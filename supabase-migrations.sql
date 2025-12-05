-- ============================================
-- MIGRATION: Adicionar expiração 48h e backup
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. Adicionar colunas à tabela stories
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '48 hours'),
ADD COLUMN IF NOT EXISTS conversation_text TEXT,
ADD COLUMN IF NOT EXISTS hidden_moments JSONB DEFAULT '[]';

-- 2. Criar índice para expiração (performance)
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);

-- 3. Atualizar stories existentes para terem expires_at
UPDATE stories 
SET expires_at = created_at + INTERVAL '48 hours'
WHERE expires_at IS NULL;

-- 4. Criar tabela de backup antes de deletar
CREATE TABLE IF NOT EXISTS stories_backup (
  id UUID PRIMARY KEY,
  original_slug VARCHAR(8),
  backup_data JSONB NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para cleanup de backups antigos
CREATE INDEX IF NOT EXISTS idx_stories_backup_deleted_at ON stories_backup(deleted_at);

-- 5. Criar função para backup automático antes de deletar
CREATE OR REPLACE FUNCTION backup_story_before_delete()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO stories_backup (id, original_slug, backup_data)
  VALUES (
    OLD.id,
    OLD.slug,
    row_to_json(OLD)::jsonb
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para fazer backup
DROP TRIGGER IF EXISTS backup_story_trigger ON stories;
CREATE TRIGGER backup_story_trigger
  BEFORE DELETE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION backup_story_before_delete();

-- 7. RLS para stories_backup (apenas backend)
ALTER TABLE stories_backup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Backups são privados"
  ON stories_backup
  FOR ALL
  USING (false);

-- 8. Comentários nas colunas
COMMENT ON COLUMN stories.expires_at IS 'História expira 48h após criação';
COMMENT ON COLUMN stories.conversation_text IS 'Texto completo da conversa (apenas premium)';
COMMENT ON COLUMN stories.hidden_moments IS 'Array de IDs dos momentos ocultados pelo usuário';

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Ver estrutura atualizada da tabela
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'stories'
ORDER BY ordinal_position;

-- Contar stories que vão expirar nas próximas 24h
SELECT COUNT(*) as expiring_soon
FROM stories
WHERE expires_at < NOW() + INTERVAL '24 hours'
AND expires_at > NOW();

-- Ver stories já expiradas (para cleanup)
SELECT slug, expires_at, created_at
FROM stories
WHERE expires_at < NOW()
ORDER BY expires_at DESC;

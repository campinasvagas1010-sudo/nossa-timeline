// Script para executar migration de pagamentos no Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://icobpmuaurvtlhxvfump.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2JwbXVhdXJ2dGxoeHZmdW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM0NDEyMCwiZXhwIjoyMDQ4OTIwMTIwfQ.iL0gxLFzI-NLljM7x0u10CtH7lJUHE5vAT8tZWx6Lro';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  console.log('🔧 Executando migration de pagamentos...\n');

  try {
    // Executar migration SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        -- Adicionar colunas de pagamento
        ALTER TABLE stories 
        ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100),
        ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'approved', 'rejected', 'cancelled')),
        ADD COLUMN IF NOT EXISTS payer_email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS payer_name VARCHAR(255);

        -- Criar índices para performance
        CREATE INDEX IF NOT EXISTS idx_stories_payment_id ON stories(payment_id);
        CREATE INDEX IF NOT EXISTS idx_stories_payment_status ON stories(payment_status);
      `
    });

    if (error) {
      console.error('❌ Erro ao executar migration:', error);
      console.log('\n⚠️  Método RPC não disponível. Executando via REST API...\n');
      
      // Tentar método alternativo
      const queries = [
        "ALTER TABLE stories ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100)",
        "ALTER TABLE stories ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'approved', 'rejected', 'cancelled'))",
        "ALTER TABLE stories ADD COLUMN IF NOT EXISTS payer_email VARCHAR(255)",
        "ALTER TABLE stories ADD COLUMN IF NOT EXISTS payer_name VARCHAR(255)",
        "CREATE INDEX IF NOT EXISTS idx_stories_payment_id ON stories(payment_id)",
        "CREATE INDEX IF NOT EXISTS idx_stories_payment_status ON stories(payment_status)"
      ];

      for (const query of queries) {
        console.log(`Executando: ${query.substring(0, 60)}...`);
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
          },
          body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log(`  ⚠️  ${errorText}`);
        } else {
          console.log('  ✅');
        }
      }
    } else {
      console.log('✅ Migration executada com sucesso!');
    }

    // Verificar se as colunas foram criadas
    console.log('\n🔍 Verificando estrutura da tabela...\n');
    const { data: columns, error: checkError } = await supabase
      .from('stories')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar:', checkError);
    } else {
      console.log('✅ Tabela stories estrutura OK!');
      if (columns && columns.length > 0) {
        console.log('Colunas disponíveis:', Object.keys(columns[0]));
      }
    }

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

runMigration();

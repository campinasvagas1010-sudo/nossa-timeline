import os
from supabase import create_client, Client

# Credenciais
url = "https://icobpmuaurvtlhxvfump.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2JwbXVhdXJ2dGxoeHZmdW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM0NDEyMCwiZXhwIjoyMDQ4OTIwMTIwfQ.iL0gxLFzI-NLljM7x0u10CtH7lJUHE5vAT8tZWx6Lro"

supabase: Client = create_client(url, key)

print("🔧 Testando conexão com Supabase...")

try:
    # Testar conexão
    result = supabase.table('stories').select("id").limit(1).execute()
    print(f"✅ Conexão OK! Encontradas {len(result.data)} stories")
    
    if result.data:
        print(f"Colunas disponíveis: {list(result.data[0].keys())}")
    
except Exception as e:
    print(f"❌ Erro: {e}")

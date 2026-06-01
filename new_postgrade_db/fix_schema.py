import re

schema_path = r"c:\Users\Usuario\Documents\trae_projects\Beatriz Publisher\Portal Neural Nexus\new_postgrade_db\schema_final.sql"

with open(schema_path, "r", encoding="utf-8") as f:
    sql = f.read()

# 1. Hacer los índices idempotentes
sql = sql.replace("CREATE UNIQUE INDEX", "CREATE UNIQUE INDEX IF NOT EXISTS")
# Cuidamos de no reemplazar el "IF NOT EXISTS" doblemente si ya lo corrimos
sql = sql.replace("CREATE UNIQUE INDEX IF NOT EXISTS IF NOT EXISTS", "CREATE UNIQUE INDEX IF NOT EXISTS")
sql = sql.replace("CREATE INDEX", "CREATE INDEX IF NOT EXISTS")
sql = sql.replace("CREATE INDEX IF NOT EXISTS IF NOT EXISTS", "CREATE INDEX IF NOT EXISTS")
sql = sql.replace("CREATE UNIQUE INDEX IF NOT EXISTS", "CREATE UNIQUE INDEX IF NOT EXISTS")

# 2. Hacer las policies idempotentes
# Buscamos patrones como: CREATE POLICY "Nombre" ON public.tabla
policy_pattern = re.compile(r'CREATE POLICY\s+("[^"]+")\s+ON\s+public\.([a-zA-Z0-9_]+)', re.IGNORECASE)

def policy_replacer(match):
    policy_name = match.group(1)
    table_name = match.group(2)
    return f'DROP POLICY IF EXISTS {policy_name} ON public.{table_name};\nCREATE POLICY {policy_name} ON public.{table_name}'

sql = policy_pattern.sub(policy_replacer, sql)

with open(schema_path, "w", encoding="utf-8") as f:
    f.write(sql)

print("schema_final.sql parcheado para ser 100% a prueba de balas (idempotente).")

import codecs

#  Leer el archivo con encoding UTF-8
with codecs.open('backup/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Hacer los reemplazos
content = content.replace('COLECCIÃ"N', 'COLECCIÓN')
content = content.replace('CategorÃ­as', 'Categorías')
content = content.replace('ColecciÃ³n', 'Colección')
content = content.replace('VÃA', 'V ÍA')

# Escribir el archivo corregido
with codecs.open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Correcciones aplicadas correctamente")

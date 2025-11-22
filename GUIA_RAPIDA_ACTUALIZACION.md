# 🚀 Guía Rápida: Actualizar tu Catálogo

Cada vez que hagas cambios en tu catálogo (agregar productos, cambiar precios, etc.), sigue estos 4 pasos:

## 📝 Los 4 Comandos Mágicos

Abre tu terminal en la carpeta `Boutique` y ejecuta:

```bash
# 1. Ver qué archivos cambiaron (opcional, para verificar)
git status

# 2. Agregar todos los cambios
git add .

# 3. Crear un commit con un mensaje descriptivo
git commit -m "Tu mensaje aquí"

# 4. Subir a GitHub
git push
```

**¡Listo!** En 1-2 minutos, Netlify actualizará automáticamente tu sitio web.

---

## 💡 Ejemplos de Mensajes de Commit

Usa mensajes descriptivos para saber qué cambiaste:

```bash
git commit -m "Actualización de precios de productos"
git commit -m "Agregado vestido azul de verano"
git commit -m "Eliminado producto agotado: tenis negros"
git commit -m "Cambiado logo de la boutique"
git commit -m "Actualización de información de contacto"
```

---

## 🎯 Atajos Útiles

### Actualizar TODO de una vez (3 comandos en 1 línea)

```bash
git add . && git commit -m "Actualización de productos" && git push
```

---

## 📱 ¿Cómo Ver tus Cambios?

1. Ve a tu repositorio en GitHub: <https://github.com/elcienty89/moonlight-boutique>
2. Ve a tu sitio en Netlify: <https://app.netlify.com>
3. Espera 1-2 minutos después de hacer `git push`
4. Refresca tu sitio web en el navegador (F5)

---

## ⚠️ Notas Importantes

- **Siempre guarda los archivos** antes de hacer `git add .`
- **Usa mensajes claros** en tus commits para saber qué cambiaste
- **No edites directamente en GitHub** - siempre edita localmente y luego haz push
- Si tienes dudas, ejecuta `git status` para ver el estado actual

---

## 🆘 Comandos de Emergencia

### Ver el historial de cambios

```bash
git log --oneline
```

### Ver qué archivos fueron modificados

```bash
git status
```

### Deshacer cambios antes de hacer commit

```bash
git restore nombre-del-archivo.js
```

---

**🎉 ¡Ahora tienes todo automatizado!** Solo edita, guarda, y usa los 4 comandos mágicos.

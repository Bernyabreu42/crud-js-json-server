const d = document,
  $table = d.getElementById('table'),
  $tbody = $table.querySelector('tbody'),
  $template = d.getElementById('table_body').content,
  $title = d.getElementById('changeText'),
  $btn = d.getElementById('btn_toggle'),
  $form = d.querySelector('form'),
  $select = $form.select,
  apiUrl = 'http://localhost:3000/notes',
  fragment = d.createDocumentFragment();

//mostrar todos los elementos del api-------------------
const getAll = async () => {

  try {
    let req = await fetch(apiUrl);

    if (!req.ok) throw ({
      status: req.status,
      error: !req.statusText ? "ha ocuddio un error" : req.statusText
    })

    let res = await req.json();

    res.forEach(note => {
      const { id, content, fecha, important } = note

      $template.querySelector('.id').textContent = id
      $template.querySelector('.content').textContent = content
      $template.querySelector('.fecha').textContent = fecha
      $template.querySelector('.importante').textContent = important

      let $clone = d.importNode($template, true);
      fragment.appendChild($clone)

    })
    $tbody.appendChild(fragment)
  } catch (error) {
    let message = error.statusText || "ha ocurrido un error"
    $table.insertAdjacentHTML('afterend', `<p>Error: ${message}</p>`)
  }

}

//agregar un nuevo elemento -------------------
$form.addEventListener('submit', async (e) => {
  e.preventDefault()

  console.log(e.target.content.value)


  const newNote = {
    content: e.target.content.value,
    important: $select.value,
    fecha: new Date().toISOString()
  }

  await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(newNote),
  });

  location.reload()

})

// eliminar un elemento de la table -------------------
d.addEventListener('click', async (e) => {
  if (e.target.matches('.eliminar')) {
    const target = e.target;

    const id = target.parentElement.parentElement.querySelector('.id').textContent;

    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
    });

    location.reload()
  }

  //variables-------------------
  const $target = e.target.parentElement.parentElement;
  const $content = $target.querySelector('.content').textContent
  const $important = $target.querySelector('.importante').textContent
  const $id = $target.querySelector('.id').textContent

  //editar un elemento de la tabla
  if (e.target.matches('.editar')) {
    $form.content.value = $content;
    $form.select.value = $important
    $form.id.value = $id
    $title.innerHTML = "Editar nota"
    $btn.innerHTML = "Modificar"
    $btn.setAttribute('type', 'button')

  }

  const updateNote = {
    content: $form.content.value,
    important: $form.select.value,
    fecha: new Date().toISOString()
  }

  // actualizar un elemento de la tabla
  if (e.target.matches('#btn_toggle')) {
    const id = $form.id.value

    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateNote)
    })

  }

})

d.addEventListener('DOMContentLoaded', getAll)
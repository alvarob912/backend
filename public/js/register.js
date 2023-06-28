const registerUser = async(event) =>{
    event.preventDefault()
    const form = document.getElementById('register-form')
    const formData = new FormData(form)
    fetch('/api/session/register', {
        method: 'POST',
        body: formData,
        headers: {
            type: 'profile-img'
        }
    })
    .then((response) => {
        if (response.ok) {
          alert('Usuario creado. Por favor, inicie sesión.')
          document.location = '/'
        } else {
          alert("Error al enviar el formulario");
        }
      })
} 
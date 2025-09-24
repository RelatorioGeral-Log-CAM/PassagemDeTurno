// Local: public/auth.js
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // --- SUA LISTA DE E-MAILS AUTORIZADOS ---
    const emailsAutorizados = [
        'enzo.tomas@grupoboticario.com.br',
        'fulano.silva@empresa.com',
        'outro.usuario@empresa.com'
    ];
    // ------------------------------------

    const emailDigitado = document.getElementById('email').value.toLowerCase();
    const errorMessage = document.getElementById('error-message');

    if (emailsAutorizados.includes(emailDigitado)) {
        sessionStorage.setItem('usuarioAutenticado', 'true');
        // O caminho para o index aqui é a raiz do site, pois o build colocará tudo junto na pasta 'dist'
        window.location.href = '/index.html'; // ou apenas '/'
    } else {
        errorMessage.style.visibility = 'visible';
    }
});
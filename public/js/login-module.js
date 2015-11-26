CORE.create_module("login-form-container", function (sb) {
    var usernameInputField,
        passwordInputField,
        submitLoginFormButton,
        loginForm,
        loginFormErrors;

    return {
        init : function () {
            usernameInputField = sb.find('#username')[0];
            passwordInputField = sb.find('#password')[0];
            submitLoginFormButton = sb.find('#send-login-button')[0];
            loginForm = sb.find('#login-form')[0];
            loginFormErrors = sb.find('#login-form-errors')[0];

            sb.addEvent(loginForm, "submit", this.send);
        },
        destroy : function () {
            sb.removeEvent(loginForm, "submit", this.send);
            
            usernameInputField = null;
            passwordInputField = null;
            submitLoginFormButton = null;
            loginForm = null;
            loginFormErrors = null;
        },
        send : function (ev) {
            ev.preventDefault();
            
            sb.loginViaAjax(
                usernameInputField.value,
                passwordInputField.value,
                function (loginResponse) {
                    if (loginResponse.success) {
                        sb.redirectTo('/');
                    }
                    else
                    {
                        loginFormErrors.innerHTML = loginResponse.message;
                    }
                }
            );
        }
    };
});

CORE.start_all();

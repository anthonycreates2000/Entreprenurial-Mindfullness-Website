import Localization from "../../utils/localization";
import Swal from "sweetalert2"
import FetchHelpers from "../../utils/fetch-helpers";
import ApiEndpoint from "../../globals/api-endpoint";
import SwalCustomFunctions from "../../globals/swal-custom-function";
import HTMLHelpers from "../../globals/htnl-helpers";
import Validation from "../../globals/validation";
import UserGlobal from "../../globals/user-helpers";
import WindowController from "../../utils/window-manager";
import MyFetch from "../../globals/my-fetch";

class LoginPage extends HTMLElement{
    constructor(){
        super();
        this.loginElement = document.createElement("div");
    }
    render(){
        this.loginElement.innerHTML = `
            <div class = "h1-header">
                <h1 data-i18n-key = "Login">Login</h1>
            </div>
            <div class = "container">
                <div class = "row">
                    <div class = "col-sm-12 col-md-6 col-lg-6">
                        <img loading = 'lazy' alt = 'Login Image' src = "./images/Compressed/read_compressed.png" id = "login-image" srcset = "./images/Compressed/read_compressed.png">
                    </div>
                    <div class = "col-sm-12 col-md-6 col-lg-6">
                        <div class = "form-group">
                            <label for = "email" data-i18n-key = "email">Email</label>
                            <input type = "text" name = "email" id = "email" class = "form-control">
                            <div class="invalid-feedback">
                            </div>
                        </div>
                        <div class = "form-group">
                            <label for = "password" data-i18n-key = "Password">Password</label>
                            <input type = "password" name = "password" id = "password" class = "form-control">
                            <div class="invalid-feedback">
                            </div>    
                        </div>
                        <div class = "form-group">
                            <div class = "row">
                                <div class = "col-sm-12 col-md-6 col-lg-6">
                                    <button type = "button" class = "action-button" id = "login" name = "login" data-i18n-key = "Login">Login</button>
                                </div>
                                <div class = "col-sm-12 col-md-6 col-lg-6">
                                    <button type = "button" class = "secondary-action-button" id = "reactivate" name = "reactivate" data-i18n-key = "reactivate">Reactivate</button>
                                </div>
                            </div>
                        </div>
                        <div class = "form-group">
                            <a href = "#register" data-i18n-key = "not_already_registered"></a>
                        </div>
                    </div>
                </div>
                <!-- <div class = "form-group">
                    <label class = "control control-checkbox">
                        <label data-i18n-key = "keep_sign_in" for = "keep_sign_in">Keep me signed in</label>
                        <input type = "checkbox" id = "keep_sign_in" name = "keep_sign_in" />
                        <div class = "control_indicator"></div>
                    </label>
                </div> -->
                
                <!-- <div class = "form-group">
                    <button class = "btn secondary-action-link" type = "button" id = "forgot_password" data-i18n-key = "forgot_password">Forgot your password?</button>
                </div> -->
            </div>
        `;
        // this.forgotPasword();
    }
    validateForm(json){
        if (Validation.validateEmail(json.email).isTrue === false){
            const validation = Validation.validateEmail(json.email)
            validation.element = "#email"
            return validation
        }
        else if (Validation.validatePassword(json.password).isTrue === false){
            const validation = Validation.validatePassword(json.password)
            validation.element = "#password"
            return validation
        }
        return {"isTrue": true}
    }
    setLoginButtonListener(){
        const loginElement = this.loginElement.querySelector('#login');
        loginElement.addEventListener("click", async () => {
            const email = this.loginElement.querySelector("#email").value;
            const password = this.loginElement.querySelector("#password").value;

            const jsonRequestBody = {
                "email": email,
                "password": password
            }
            
            const validationResult = this.validateForm(jsonRequestBody)
            if (validationResult.isTrue === false){
                HTMLHelpers.makeInvalidStatusField(this.loginElement, validationResult)
                this.loginElement.querySelector(validationResult.element).focus()
            }
            else{
                const jsonRequestData = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        mode: 'cors',
                    },
                    body: JSON.stringify(jsonRequestBody)
                };
                SwalCustomFunctions.initializeLoadingPopUp();
                const responseJSONData = await FetchHelpers.getJSONResult(
                    ApiEndpoint.getLoginLink(),
                    jsonRequestData,
                );
            
                if (responseJSONData.status === 401){
                    Swal.fire({
                        title: `Oops!`,
                        icon: 'error',
                        showCancelButton: false,
                        showConfirmButton: false,
                        html: `
                            <p>${Localization.getLocalizedText("wrong-password")}/ ${Localization.getLocalizedText("email_not_found")}</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" style = "width: 100%">OK</button>
                        `
                    })
                    SwalCustomFunctions.initializeCloseButton();
                }
                else if (responseJSONData.status === 402){
                    Swal.fire({
                        title: Localization.getLocalizedText("inactive_account_detected"),
                        icon: 'warning',
                        showCancelButton: false,
                        showConfirmButton: false,
                        showCloseButton: false,
                        allowOutsideClick: false,
                        html: `
                            <p>${Localization.getLocalizedText("inactive_account_message")}</p>
                            <p>${Localization.getLocalizedText("inactive_account_message_2")}</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" style = "width: 100%">OK</button>
                        `
                    })
                    SwalCustomFunctions.initializeCloseButton();
                }
                else if (responseJSONData.status === 200){
                    UserGlobal.setJWTToken(responseJSONData.json.data.access_token)
                    UserGlobal.saveUserData(responseJSONData.json.data.user)
                    // UserGlobal.setUserData(responseJSONData.json.data.user)
                    Swal.fire({
                        title: "Hello!",
                        icon: "success",
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        html: `
                            <p>${Localization.getLocalizedText('success-login')}</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                        `
                    })
                    SwalCustomFunctions.initializeCloseButton()
                    WindowController.setWindowURLHash("profile_intro")
                }
                else{
                    Swal.fire({
                        title: `Oops!`,
                        icon: 'error',
                        showCancelButton: false,
                        showConfirmButton: false,
                        html: `
                            <p>Unknown Error Occured</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                        `,
                    });
                    SwalCustomFunctions.initializeCloseButton();
                }
            }
        });
    }
    setReactivateButtonListener(){
        const reactivateButtonElement = this.loginElement.querySelector("#reactivate");
        reactivateButtonElement.addEventListener("click", async () => {
            const email = this.loginElement.querySelector("#email").value;
            const password = this.loginElement.querySelector("#password").value;
            const jsonRequestBody = {
                "email": email,
                "password": password,
            }
            const validationResult = this.validateForm(jsonRequestBody)
         
            if (validationResult.isTrue === false){
                HTMLHelpers.makeInvalidStatusField(this.loginElement, validationResult)
                this.loginElement.querySelector(validationResult.element).focus()
            }
            else{
                SwalCustomFunctions.initializeLoadingPopUp();
                const jsonResponseData = await MyFetch.reactivateAccount(email, password);
                if (jsonResponseData.status === 200){
                    UserGlobal.saveUserData(jsonResponseData.json.data.user)
                    UserGlobal.setJWTToken(jsonResponseData.json.data.access_token)
                    Swal.fire({
                        title: "Hooray!",
                        icon: "success",
                        showCancelButton: false,
                        showCloseButton: false,
                        showConfirmButton: false,
                        html: `
                            <p>${Localization.getLocalizedText("reactivate_account_success")}</p>
                            <p>${Localization.getLocalizedText("nice_to_meet_you_again")}</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" style = "width: 100%">OK</button>
                        `,
                    });
                    
                    WindowController.setWindowURLHash("profile_intro")
                }
                else if (jsonResponseData.status === 401){
                    Swal.fire({
                        title: "Oops!",
                        icon: "error",
                        showCancelButton: false,
                        showCloseButton: false,
                        showConfirmButton: false,
                        html: `
                            <p>${Localization.getLocalizedText("wrong-password")}</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" style = "width: 100%">OK</button>
                        `,
                    });
                }
                else if (jsonResponseData.status === 404){
                    Swal.fire({
                        title: "Oops!",
                        icon: "error",
                        showCancelButton: false,
                        showCloseButton: false,
                        showConfirmButton: false,
                        html: `
                            <p>${Localization.getLocalizedText("no_inactivate_account")}</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" style = "width: 100%">OK</button>
                        `,
                    })
                }
                else{
                    Swal.fire({
                        title: "Oops!",
                        icon: "error",
                        showCancelButton: false,
                        showCloseButton: false,
                        showConfirmButton: false,
                        html: `
                            <p>${Localization.getLocalizedText("unknown_error_occured")}</p>
                            <button type = "button" id = "swal-close-button" class = "action-button" style = "width: 100%">OK</button>
                        `,
                    })
                }
                SwalCustomFunctions.initializeCloseButton();
            }
        });
    }
    setListeners(){
        const inputElements = this.loginElement.querySelectorAll("input");

        inputElements.forEach((element) => {
            element.addEventListener("input", () => {
                HTMLHelpers.makeRegularStatusField(this.loginElement, `#${element.id}`)
            })
        })

        this.setLoginButtonListener();
        this.setReactivateButtonListener();
    }
    async init(){
        this.render();
        Localization.initTranslate();
        this.setListeners();
        this.appendChild(this.loginElement);
    }
}

customElements.define("login-page", LoginPage);
export default LoginPage;
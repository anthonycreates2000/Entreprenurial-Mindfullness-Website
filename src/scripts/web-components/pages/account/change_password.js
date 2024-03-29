import Swal from "sweetalert2";
import HTMLHelpers from "../../../globals/htnl-helpers";
import MyFetch from "../../../globals/my-fetch";
import SwalCustomFunctions from "../../../globals/swal-custom-function";
import Validation from "../../../globals/validation";
import Localization from "../../../utils/localization";
import WindowController from "../../../utils/window-manager";

class ChangePasswordPage extends HTMLElement{
    constructor(){
        super();
        this.changePasswordElement = document.createElement("div");
    }
    render(){
        this.changePasswordElement.innerHTML = `
            <div class = "container">
                <div class = "row">
                    <div class = "col-sm-6 col-md-6 col-lg-6">
                        <img alt = "Change Password Image" src = "./images/lock.png" id = "change-password-image">
                    </div>
                    <div class = "col-sm-6 col-md-6 col-lg-6">
                        <h1 data-i18n-key = "change_password"></h1>
                        <form>
                            <div class = "form-group">
                                <label for = "current_password" data-i18n-key = "current_password"></label>
                                <input class = "form-control" type = "password" id = "current_password" name = "current_password">
                                <div class = "invalid-feedback">
                                
                                </div>
                            </div>
                            <div class = "form-group">
                                <label for = "new_password" data-i18n-key = "new_password"></label>
                                <input class = "form-control" type = "password" id = "new_password" name = "new_password">
                                <div class = "invalid-feedback">
                                    
                                </div>
                            </div>
                            <div class = "form-group">
                                <label for = "confirm_password" data-i18n-key = "confirm_password"></label>
                                <input class = "form-control" type = "password" id = "confirm_password" name = "confirm_password">
                                <div class = "invalid-feedback">

                                </div>
                            </div>
                            <button id = "apply-password" type = "button" class = "action-button" data-i18n-key = "update"></button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
    validateForm(json){
        if (Validation.validatePassword(json.password).isTrue === false){
            const validation = Validation.validatePassword(json.password)
            validation.element = "#current_password"
            return validation
        }
        else if (Validation.validatePassword(json.new_password).isTrue === false){
            const validation = Validation.validatePassword(json.new_password)
            validation.element = "#new_password"
            return validation
        }
        else if (Validation.validateConfirmPassword(json.new_password, json.confirm_password).isTrue === false){
            const validation = Validation.validateConfirmPassword(json.new_password, json.confirm_password)
            validation.element = "#confirm_password"
            return validation
        }
        return {'isTrue': true, "message": ""}
    }
    async submitPassword(){
        const password = this.changePasswordElement.querySelector("#current_password").value;
        const newPassword = this.changePasswordElement.querySelector("#new_password").value;
        const confirmPassword = this.changePasswordElement.querySelector("#confirm_password").value;

        const jsonRequestBody = {
            "password": password,
            "new_password": newPassword,
            "confirm_password": confirmPassword
        }
        
        const validationResult = this.validateForm(jsonRequestBody)

        if (validationResult.isTrue === false){
            HTMLHelpers.makeInvalidStatusField(this.changePasswordElement, validationResult)
            this.changePasswordElement.querySelector(validationResult.element).focus()
            return
        }

        SwalCustomFunctions.initializeLoadingPopUp()
        const responseJSONData = await MyFetch.changePassword(jsonRequestBody);
        if (responseJSONData.status === 200){
            Swal.fire({
                title: 'Hooray!',
                icon: 'success',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                html: `
                    <p>${Localization.getLocalizedText("success-change-password")}</p>
                    <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                `,
            });
            SwalCustomFunctions.initializeCloseButton()
            WindowController.setWindowURLHash("account/account-info");
        }
        else if (responseJSONData.status === 401){
            Swal.fire({
                title: 'Oops!',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                html: `
                    <p>${Localization.getLocalizedText("change_password_wrong_current_password")}</p>
                    <button type = "button" id = "swal-close-button" class = "action-button" style = "width: 100%">OK</button>
                `,
            });
            SwalCustomFunctions.initializeCloseButton()
        }
    }
    setListeners(){
        const inputElements = this.changePasswordElement.querySelectorAll("input[type='password']");
        const changePasswordButton = this.changePasswordElement.querySelector("#apply-password");

        inputElements.forEach(element => {
            element.addEventListener("input", () => {
                HTMLHelpers.makeRegularStatusField(this.changePasswordElement, `#${element.id}`);
            })
        }); 

        changePasswordButton.addEventListener("click", () => {
            this.submitPassword()
        })
    }
    async init(){
        this.render();
        this.setListeners();
        this.appendChildren();
    }
    appendChildren(){
        this.appendChild(this.changePasswordElement)
    }
}

customElements.define("change_password-page", ChangePasswordPage);
export default ChangePasswordPage;
import Swal from "sweetalert2";
import HTMLHelpers from "../../../globals/htnl-helpers";
import MyFetch from "../../../globals/my-fetch";
import Validation from "../../../globals/validation";
import Localization from "../../../utils/localization";
import UserGlobal from "../../../globals/user-helpers";
import WindowController from "../../../utils/window-manager";
import SwalCustomFunctions from "../../../globals/swal-custom-function";

class InactiveAccountPage extends HTMLElement{
    constructor(){
        super();
        this.deletePasswordElement = document.createElement("div");
    }
    async init(){
        this.render();
        this.setListeners();
        this.appendChildren();
    }
    render(){
       this.deletePasswordElement.innerHTML = `
            <div class = "container">
                <img src = "./images/power_button.png" id = "delete-account-icon" alt = "Deactivate Account Image.">
                <p id = "deactivate_account_confirmation" data-i18n-key = "deactivate_account_confirmation">Are you sure you want to delete your account?</p>
                <p id = "deactivate_account_confirmation_2" data-i18n-key = "deactivate_account_confirmation_2"></p>
                <form>
                    <input type = "password" class = "form-control" id = "delete-account-password" name = "delete-account-password">
                    <div class = "invalid-feedback">
                    </div>
                    <button id = "inactive_account_button" data-i18n-key = "deactivate_account" type = "button" class = "danger-action-button"></button>
                </form>  
            </div>
       `;
    }
    validateForm(json){
        if (Validation.validatePassword(json.password).isTrue === false){
            const validation = Validation.validatePassword(json.password)
            validation.element = "#delete-account-password"
            return validation
        }
        return {'isTrue': true, 'message': ""}
    }
    setListeners(){
        const deleteAccountButton = this.deletePasswordElement.querySelector("#inactive_account_button")
        const inputElements = this.deletePasswordElement.querySelectorAll("input[type='text']");

        inputElements.forEach(element => {
            element.addEventListener("input", () => {
                HTMLHelpers.makeRegularStatusField(this.deletePasswordElement, `#${element.id}`);
            })
        }); 

        deleteAccountButton.addEventListener("click", async () => {
            const password = this.deletePasswordElement.querySelector("#delete-account-password").value;

            const jsonRequestBody = {
                "password": password,
            }

            const validationResult = this.validateForm(jsonRequestBody)

            if (validationResult.isTrue === false){
                HTMLHelpers.makeInvalidStatusField(this.deletePasswordElement, validationResult)
                return
            }
            await this.submitDeletePassword(jsonRequestBody)    
        });
    }
    async submitDeletePassword(jsonRequestBody){
        SwalCustomFunctions.initializeLoadingPopUp();
        const responseBody = await MyFetch.getDeleteAccountLink(jsonRequestBody.password)

        if (responseBody.status === 200){
            Swal.fire({
                title: "Hooray",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                html: `
                    <p>${Localization.getLocalizedText("success-delete-account")}</p>
                    <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                `
            })
            UserGlobal.logoutUser()
            WindowController.setWindowURLHash("login")
        }
        else if (responseBody.status === 401){
            Swal.fire({
                title: "Oops",
                icon: "error",
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                html: `
                    <p>${Localization.getLocalizedText('wrong-password')}</p>
                    <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                `
            })
        }
        SwalCustomFunctions.initializeCloseButton();
    }
    appendChildren(){
        this.appendChild(this.deletePasswordElement);
    }
}

customElements.define("inactive_account-page", InactiveAccountPage);
export default InactiveAccountPage;
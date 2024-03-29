import Localization from "../../utils/localization";
import FetchHelpers from "../../utils/fetch-helpers";
import ApiEndpoint from "../../globals/api-endpoint";
import Swal from "sweetalert2";
import MyFetch from "../../globals/my-fetch";
import SwalCustomFunctions from "../../globals/swal-custom-function";
import Validation from "../../globals/validation";
import HTMLHelpers from "../../globals/htnl-helpers";
import WindowController from "../../utils/window-manager";
import UserGlobal from "../../globals/user-helpers";

class RegisterPage extends HTMLElement{
    constructor(){
        super();
        this.registerElement = document.createElement("div");
        this.isProvinceAvailable = false;
        this.provinceJSON = {}
    }
    render(){
        this.registerElement.innerHTML = `
            <div class = "h1-header">
                <h1 data-i18n-key = "Register">Register</h1>
            </div>
            <div class = "container">
                <form class = "needs-validation" novalidate>
                    <div class = "row">
                        <div class = "col-sm-12 col-md-12 col-lg-12">
                            <img src = "./images/Compressed/waiting_compressed.png" id = "register-image">
                        </div>
                        <div class = "col-sm-12 col-md-12 col-lg-12">
                            <div class = "form-group">
                                <label for = "e_mail_address" data-i18n-key = "e_mail_address">E-mail address</label>
                                <input type = "text" class = "form-control" id = "email" name = "email">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class = "form-group">
                                <label for = "password" data-i18n-key = "Password">Password</label>
                                <input type = "password"  class = "form-control" id = "password" name = "password">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class = "form-group">
                                <label for = "confirm_password" data-i18n-key = "confirm_password">Confirm Password</label>
                                <input type = "password"  class = "form-control" id = "confirm_password" name = "confirm_password">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class = "form-group">
                                <label for = "fullname" data-i18n-key = "fullname">Full name</label>
                                <input type = "text"  class = "form-control" id = "fullname" name = "fullname">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class = "form-group">
                                <label data-i18n-key = "gender">Gender</label>
                                <br>
                                <div class = "form-check-inline">
                                    <input class="form-check-input" type="radio" id="Male" name="gender" value="Male" checked>
                                    <label class="form-check-label" for="Male" data-i18n-key = "male">Male</label>
                                </div>
                                <div class = "form-check-inline">
                                    <input class="form-check-input" type="radio" id="Female" name="gender" value="Female">
                                    <label class="form-check-label" for="Female" data-i18n-key = "female">Female</label>
                                </div>
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class = "form-group">
                                <label for = "country_id" data-i18n-key = "country">Country</label>
                                <select type = "text"  class = "form-control" id = "country_id" name = "country_id"></select>
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class = "form-group">
                                <label for = "province_id" data-i18n-key = "province">Province</label>
                                <select type = "text"  class = "form-control" id = "province_id" name = "province_id"></select>
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-sm">
                                    <div class = "form-group">
                                        <label for = "age" data-i18n-key = "age">Age</label>
                                        <select type = "text"  class = "form-control" id = "age_id" name = "age_id"></select>
                                        <div class="invalid-feedback">
                                        </div>
                                    </div>
                                    <div class = "form-group">
                                        <label for = "status" data-i18n-key = "status">Status</label>
                                        <select type = "text"  class = "form-control" id = "status_id" name = "status_id"></select>
                                        <div class="invalid-feedback">
                                        </div>
                                    </div>
                                </div>
                                <div class = "col-sm">
                                    <div class = "form-group">
                                        <label for = "type_of_business" data-i18n-key = "type_of_business">Type of Business</label>
                                        <select class = "form-control" id = "business_id" name = "business_id"></select>
                                        <div class="invalid-feedback">
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div class = "form-group">
                                <button type = "button" id = "register" class = "action-button" data-i18n-key = "Register">Register</button>
                            </div>
                            <div class = "form-group">
                                <a href = "#login" data-i18n-key = "already_registered"></a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        `;
    }
    async fetchData(){
        await this.addCountriesOptionElement();
        this.addProvincesOptionElement();
        this.addAgesOptionElement();
        this.addStatusesOptionElement();
        this.addBusinessesOptionElement();
    }
    addProvincesOfflineOptionElement(){
        const selectProvincesElement = this.registerElement.querySelector("#province_id");
        const selectCountryElement = this.registerElement.querySelector("#country_id");

        const filteredProvinceJSON = this.provinceJSON.filter(province => province.country_id == selectCountryElement.value)
        selectProvincesElement.innerHTML = ""

        if (filteredProvinceJSON.length === 0){
            this.isProvinceAvailable = false;
        }
        else{
            this.isProvinceAvailable = true;
        }

        filteredProvinceJSON.forEach((province) => {
            const optionElement = document.createElement("option")
            optionElement.innerText = province.name
            optionElement.value = province.id
            selectProvincesElement.appendChild(optionElement)
        })
    }
    async addProvincesOptionElement(){
        const provinceJSON = await FetchHelpers.getJSONResult(
            ApiEndpoint.getProvinceAllLink(),
            FetchHelpers.getDefaultRequestBody(),
        )

        if (provinceJSON.status === 200){
            this.provinceJSON = provinceJSON.json;
            const selectProvincesElement = this.registerElement.querySelector("#province_id");
            const selectCountryElement = this.registerElement.querySelector("#country_id");
            
            this.provinceJSON.forEach((province) => {
                const optionElement = document.createElement("option")
                optionElement.innerText = province.name
                optionElement.value = province.id
                selectProvincesElement.appendChild(optionElement)
            });
            selectCountryElement.addEventListener("change", () => {
                this.addProvincesOfflineOptionElement();
            });
        }
    }
    async addCountriesOptionElement(){
        const countryJSON = await FetchHelpers.getJSONResult(
            ApiEndpoint.getCountryLink(),
            FetchHelpers.getDefaultRequestBody()
        )
        if (countryJSON.status === 200){
            const countries = countryJSON.json;
            const selectCountriesElement = this.registerElement.querySelector("#country_id");
            countries.forEach((country) => {
                const optionElement = document.createElement("option")
                optionElement.innerText = country.name
                optionElement.value = country.id
                selectCountriesElement.appendChild(optionElement)
            });
        }
    }
    async addStatusesOptionElement(){
        const statusJSON = await MyFetch.getStatusData()
        if (statusJSON.status === 200){
            const statuses = statusJSON.json
            const selectCountriesElement = this.registerElement.querySelector("#status_id");
            statuses.forEach((status) => {
                const optionElement = document.createElement("option");
                optionElement.innerText = status.status
                optionElement.value = status.id
                selectCountriesElement.appendChild(optionElement)
            })
        }
    }
    async addAgesOptionElement(){
        const ageJSON = await MyFetch.getAgeData()
        if (ageJSON.status === 200){
            const ages = ageJSON.json
            const selectAgeElement = this.registerElement.querySelector("#age_id");
            ages.forEach((age) => {
                const optionElement = document.createElement("option")
                optionElement.innerText = age.age
                optionElement.value = age.id
                selectAgeElement.appendChild(optionElement)
            })
        } 
    }
    async addBusinessesOptionElement(){
        const businessJSON = await MyFetch.getBusinessData()
        if (businessJSON.status === 200){
            const businesses = businessJSON.json
            const selectBusinessElement = this.registerElement.querySelector("#business_id");
            businesses.forEach((business) => {
                const optionElement = document.createElement("option")
                optionElement.innerText = business.business
                optionElement.value = business.id
                selectBusinessElement.appendChild(optionElement)
            })
        } 
    }
    async performRequest(jsonRequestBody){
        const jsonRequestData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                mode: 'cors',
            },
            body: JSON.stringify(jsonRequestBody)
        }

        const responseJSONData = await FetchHelpers.getJSONResult(
            ApiEndpoint.getRegisterLink(),
            jsonRequestData,
        )
        if (responseJSONData.status === 200){
            Swal.fire({
                title: 'Hooray!',
                icon: 'success',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                html: `
                    <p>${Localization.getLocalizedText('success-register')}</p>
                    <p>${Localization.getLocalizedText('verify_account_reminder')}</p>
                    <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                `,
            });
            UserGlobal.setOTP(responseJSONData.json.OTP)
            WindowController.setWindowURLHash("login")
        }
        else if (responseJSONData.status === 400){
            Swal.fire({
                title: 'Oops!',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                html: `
                    <p>${Localization.getLocalizedText("duplicate_username_email")}</p>
                    <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                `,
            });
        }
        else if (responseJSONData.status === -1){
            Swal.fire({
                title: 'Oops!',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                html: `
                    <p>${Localization.getLocalizedText("unknown_error_occured")}</p>
                    <button type = "button" id = "swal-close-button" class = "action-button" id = "forgot-password" style = "width: 100%">OK</button>
                `,
            });
        }
        SwalCustomFunctions.initializeCloseButton();
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
        else if (Validation.validateFullname(json.fullname).isTrue === false){
            const validation = Validation.validateFullname(json.fullname)
            validation.element = "#fullname"
            return validation
        }
        else if (Validation.validateConfirmPassword(json.password, json.confirm_password).isTrue === false){
            const validation = Validation.validateConfirmPassword(json.password, json.confirm_password)
            validation.element = "#confirm_password"
            return validation
        }
        else if (Validation.validateGender(json.gender).isTrue === false){
            const validation = Validation.validateGender(json.gender)
            validation.element = 'input[name = "gender"]'
            return validation
        }
        else if (Validation.validateCity(json.country_id).isTrue === false){
            const validation = Validation.validateCity(json.country_id)
            validation.element = "#country_id"
            return validation
        }
        else if (Validation.validateProvince(json.status_id).isTrue === false){
            const validation = Validation.validateProvince(json.status_id)
            validation.element = "#status_id"
            return validation
        }
        else if (Validation.validateAge(json.age_id).isTrue === false){
            const validation = Validation.validateAge(json.age_id)
            validation.element = "#age_id"
            return validation
        }
        else if (Validation.validateBusinessType(json.business_id).isTrue === false){
            const validation = Validation.validateBusinessType(json.business_id)
            validation.element = "#business_id"
            return validation
        }
        else{
            return {'isTrue': true, "element": null}
        }
        
    }
    setListeners(){        
        const registerButtonElement = this.registerElement.querySelector("#register");
        const inputElements = this.registerElement.querySelectorAll("input[type='text'], input[type='password'], select, .radio-group");

        inputElements.forEach(element => {
            element.addEventListener("input", () => {
                HTMLHelpers.makeRegularStatusField(this.registerElement, `#${element.id}`);
            })
        });        

        registerButtonElement.addEventListener("click", async (event) => {
            // const username = this.registerElement.querySelector("#username").value;
            const password = this.registerElement.querySelector("#password").value;
            const confirmPassword = this.registerElement.querySelector("#confirm_password").value;
            const email = this.registerElement.querySelector("#email").value;
            const fullname = this.registerElement.querySelector("#fullname").value;
            const gender = this.registerElement.querySelector("input[name = 'gender']:checked").value;
            const countryId = this.registerElement.querySelector("#country_id").value;
            const provinceId = this.registerElement.querySelector("#province_id").value;
            const ageId = this.registerElement.querySelector("#age_id").value;
            const statusId = this.registerElement.querySelector("#status_id").value;
            const businessId = this.registerElement.querySelector("#business_id").value;

            let jsonRequestBody = {}
            
            if (this.isProvinceAvailable){
                jsonRequestBody = {
                    // "username": username,
                    "password": password,
                    "confirm_password": confirmPassword,
                    "email": email,
                    "fullname": fullname,
                    "gender": gender,
                    "country_id": countryId,
                    "province_id": provinceId,
                    "age_id": ageId,
                    "status_id": statusId,
                    "business_id": businessId
                }
            }
            else{
                jsonRequestBody = {
                    // "username": username,
                    "password": password,
                    "confirm_password": confirmPassword,
                    "email": email,
                    "fullname": fullname,
                    "gender": gender,
                    "country_id": countryId,
                    "age_id": ageId,
                    "status_id": statusId,
                    "business_id": businessId
                }
            }

            const validationResult = this.validateForm(jsonRequestBody)

            if (validationResult.isTrue === false){
                HTMLHelpers.makeInvalidStatusField(this.registerElement, validationResult)
                this.registerElement.querySelector(validationResult.element).focus()
                return
            }

            // const userCheckResult = await MyFetch.userCheck(jsonRequestBody.username, jsonRequestBody.email)
            // Swal.fire({
            //     title: "Oops!",
            //     showCancelButton: false,
            //     showConfirmButton: false,
            //     html: `
            //         <p>${userCheckResult.json.message}</p>
            //         <button type = "button" class = "action-button" id = "swal-close-button" style = "width: 100%">OK</button>
            //     `
            // }).then(() => {
            //     SwalCustomFunctions.initializeCloseButton()
            // })
            SwalCustomFunctions.initializeLoadingPopUp();
            await this.performRequest(jsonRequestBody)
            
        })
    }
    async init(){
        SwalCustomFunctions.initializeLoadingPopUp();
        this.render();
        Localization.initTranslate();
        await this.fetchData();
        this.setListeners();
        this.appendChildren();
        Swal.close();
    }
    appendChildren(){
        this.appendChild(this.registerElement);
    }
}

customElements.define("register-page", RegisterPage);
export default RegisterPage;
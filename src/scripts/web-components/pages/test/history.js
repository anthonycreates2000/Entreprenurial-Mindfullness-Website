import Swal from "sweetalert2";
import MyFetch from "../../../globals/my-fetch";
import WindowController from "../../../utils/window-manager";
import SwalCustomFunction from "../../../globals/swal-custom-function"

class HistoryPage extends HTMLElement{
    constructor(){
        super();
        this.historyElement = document.createElement("div");
        this.jsonHistoryData = null;
    }
    async fetchUserAnswerHistory(){
        const jsonHistoryData = await MyFetch.getHistories()
        this.jsonHistoryData = jsonHistoryData.json
    }
    async init(){
        await this.fetchUserAnswerHistory()
        this.render();
        this.renderHistories();
        this.appendChildren();
    }
    renderHistories(){
        const userHistoriesElement = this.historyElement.querySelector("#user-histories .row");
        
        if (this.jsonHistoryData.length === 0){
            userHistoriesElement.innerHTML += `
                <div class = "container-no-data col-sm-12 col-md-12 col-lg-12">
                    <span class="material-icons material-symbols-outlined" id = "no_data_icon">
                        help
                    </span>
                    <p id = "no_data_message">Anda belum melakukan tes sama sekali! Silahkan mengikuti tes terlebih dahulu!</p>
                </div>
            `;
            return;
        }

        this.jsonHistoryData.forEach(element => {
            const userHistoryElement = document.createElement("div");
            userHistoryElement.className = "col-sm-12 col-md-4 col-lg-4 box";
            userHistoryElement.innerHTML += `
                <div class = "card">
                    <div class = "card-header">
                        <h2>${element.date}</h2>
                    </div>
                    <div class = "card-body">
                        <p><label data-i18n-key = "score"></label>: ${element.score}</p>
                        <p><label data-i18n-key = "title"></label>: ${element.title}</p>
                    </div>
                    <div class = "card-footer">
                        <a class = "action-button" href = "#result?id=${element.id}" data-i18n-key = "view_detail"></a>
                    </div>
                </div>
            `;
            userHistoriesElement.appendChild(userHistoryElement)
        });
    }
    render(){
        this.historyElement.innerHTML = `
            <div class = "h1-header">
                <h1 data-i18n-key = "user_test_history"></h1>
            </div>
            <div class = "container">
                <div class = "alert alert-primary" role = "alert">
                    <div class = "row information-row">
                        <div class = "col-sm-1 col-md-1 col-lg-1">
                            <span class="material-icons material-symbols-outlined">
                                info
                            </span>
                        </div>
                        <div class = "col-sm-11 col-md-11 col-lg-11">
                            <p data-i18n-key = "user_test_history_instructions"></p>
                        </div>
                    </div>
                </div>

                <div id = "user-histories">
                    <div class = "row">

                    </div>
                </div>
            </div>
        `;
    }
    appendChildren(){
        this.appendChild(this.historyElement)
    }
}

customElements.define("history-page", HistoryPage)
export default HistoryPage
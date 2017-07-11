/* 
 * Copyright 2017 Luca Bartolomei <bartn8@hotmal.it>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


class LogController extends Controller {
    constructor($interface, $logView, $editLogView) {
        super($interface);

        this.logView = new LogView($logView);
        this.editLogView = new EditLogView($editLogView);

        this.context = {
            currentView: -1,
            logEnabled: true
        };

        //callback
        this.logViewContext = new Object();
        this.editLogViewContext = new Object();

        //calback interfaccia
        this.interfaceContext = new Object();
    }

    init() {
        this.initCleanLogView();
        this.initLogView();
        this.viewLogView();

        //views
        this.logViewContext["logController"] = this;
        this.logViewContext["onClick"] = this.logView_onClick;

        this.logView.$this.on("LogView_onClick", $.proxy(this.logViewContext.onClick, this.logViewContext));

        this.editLogViewContext["logController"] = this;
        this.editLogViewContext["onClear"] = this.editLogView_onClear;
        this.editLogViewContext["onToggle"] = this.editLogView_onToggle;

        this.editLogView.$this.on("EditLogView_onClear", $.proxy(this.editLogViewContext.onClear, this.editLogViewContext));
        this.editLogView.$this.on("EditLogView_onToggle", $.proxy(this.editLogViewContext.onToggle, this.editLogViewContext));

        //Interfaccia
        this.interfaceContext["logController"] = this;
        this.interfaceContext["onLog"] = this.interface_onLog;

        this.on("Interface_onLog", $.proxy(this.interfaceContext.onLog, this.interfaceContext));
    }

    logView_onClick(e, $this, index) {
        $this.hide();
        $this.remove();
        //this.logController.logView.list.splice(index, 1);
    }

    editLogView_onToggle(e, $button) {
        this.logController.context.logEnabled = $button.prop("checked");
    }

    editLogView_onClear(e, $button) {
        //Ri-inizializzo il log cancellando tutto all' interno.
        this.logController.initLogView();
    }

    interface_onLog(e, title, message, level) {
        if (this.logController.context.logEnabled) {
            this.logController.logView.log(title, message, level);
        }
    }

    toggleView(index) {
        switch (index) {
            case - 1:
            case 0:
                this.context.currentView = index;
                break;
            default:
        }
        switch (index) {
            case -1:
            {
                this.logView.hide();
                break;
            }
            case 0:
            {
                this.logView.show();
                break;
            }
        }
    }

    hideAll() {
        this.toggleView(-1);
    }

    initLogView() {
        this.logView.updateView();
    }

    viewLogView() {
        this.toggleView(0);
    }

    initCleanLogView() {
        this.editLogView.updateView();
    }

}
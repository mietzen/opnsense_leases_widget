export default class Leases extends BaseTableWidget {
    constructor() {
        super();
        this.tickTimeout = 10;
    }

    getGridOptions() {
        return {
            // Trigger overflow-y:scroll after 650px height
            sizeToContent: 650
        };
    }

    getMarkup() {
        let $container = $('<div></div>');
        let $table = this.createTable('leaseTable', {
            headerPosition: 'top',
            headers: [
                this.translations.ip,
                this.translations.hostname,
                this.translations.mac,
                this.translations.type
            ]
        });

        $container.append($table);
        return $container;
    }

    async onWidgetTick() {
        // Check if dnsmasq is running
        const statusData = await this.ajaxCall('/api/dnsmasq/service/status');
        if (!statusData || statusData.status !== "running") {
            this.displayError(this.translations.servicedisabled);
            return;
        }

        // Fetch leases
        let eparams = {
            current: 1,
            inactive: false,
            rowCount: -1,
            searchPhrase: "",
            selected_interfaces: [],
            sort: {}
        };
        const leaseData = await this.ajaxCall('/api/dnsmasq/leases/search', JSON.stringify(eparams), 'POST');
        if (!leaseData || !leaseData.rows || leaseData.rows.length === 0) {
            this.displayError(this.translations.nolease);
            return;
        }

        this.processLeases(leaseData.rows);
    }

    displayError(message) {
        const $error = $(`
            <div class="error-message">
                <a href="/ui/dnsmasq/leases" target="_blank">${message}</a>
            </div>
        `);
        $('#leaseTable').empty().append($error);
    }

    processLeases(leases) {
        if (!this.dataChanged('leases', leases)) {
            return;
        }

        $('.dhcp-tooltip').tooltip('hide');

        let rows = [];
        leases.forEach(lease => {
            // Determine type (IPv4 vs IPv6)
            let type = "IPv4";
            if (lease.address && lease.address.includes(":")) {
                type = "IPv6";
            }

            // Status indicator (dnsmasq doesn’t provide online/offline, so assume active if exists)
            let colorClass = 'text-success';
            let tooltipText = this.translations.enabled;

            let currentIp = lease.address || this.translations.undefined;
            let currentMac = lease.hwaddr || this.translations.undefined;
            let currentHostname = (lease.hostname && lease.hostname !== "*") ? lease.hostname : this.translations.undefined;

            let row = [
                `
                    <div class="leases-ip" style="white-space: nowrap;">
                        <a href="/ui/dnsmasq/leases" target="_blank">
                            <i class="fa fa-circle ${colorClass} dhcp-tooltip" style="cursor: pointer;" title="${tooltipText}"></i>
                        </a>&nbsp;${currentIp}
                    </div>`,
                `<div class="leases-host">${currentHostname}</div>`,
                `<div class="leases-mac"><small>${currentMac}</small></div>`,
                `<div class="leases-type">${type}</div>`
            ];

            // Add at top (latest first)
            rows.splice(0, 0, row);
        });

        // Update table
        super.updateTable('leaseTable', rows);

        // Init tooltips
        $('.dhcp-tooltip').tooltip({container: 'body'});
    }

    onWidgetResize(elem, width, height) {
        if (width < 320) {
            $('#header_leaseTable').hide();
            $('.leases-mac').parent().hide();
            $('.leases-type').parent().hide();
        } else {
            $('#header_leaseTable').show();
            $('.leases-mac').parent().show();
            $('.leases-type').parent().show();
        }
        return true;
    }
}

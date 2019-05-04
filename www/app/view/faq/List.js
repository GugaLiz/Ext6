Ext.define('app.UserManage.ListGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'faq',
    requires: [
        'ux.SearchField'
    ],
    border: false,
    columnLines: true,
    loadMask: true,

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        var store = Ext.create("Ext.data.ArrayStore", {
            fields: [{ name: "book", name: "author" }],
            data: [["Ext  JS 4: First Look", "Loiane Groner"]]
        });

        var cols = [{
            text: "Book",
            flex: 1,
            sortable: false,
            dataIndex: "book"
        }, {
            text: "Author",
            width: 100,
            sortable: true,
            dataIndex: "author"
        }];

        me.columns = {
            items: cols,
            defaults: { sortable: false, menuDisabled: true }
        };

        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true
        });

        me.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                text: 'AddTip',
                iconCls: 'add',
                handler: function () {
                    var win = me._addWin;
                    if (!win) {
                        win = Ext.create('Fleet5.UserManage.EditWin', {
                            PassStrategy: me.PassStrategy,
                            listeners: {
                                update_success: function (cmp) {
                                    store.load();
                                    cmp.hide();
                                }
                            }
                        });
                        me._addWin = win;
                    }
                    win.show();
                }
            }, {
                text: 'DelTip',
                iconCls: 'delete',
                handler: function () {

                }
            }, '->', {
                labelWidth: 38,
                fieldLabel: 'Search',
                labelAlign: 'right',
                store: store,
                xtype: 'searchfield',
                paramName: 'QueryValue',
                width: 220
            }]


        }]
    }
});
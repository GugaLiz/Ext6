//Ext.define("Ext.locale.en.ux.picker.DateTimePicker", {
//	  override: "Ext.ux.DateTimePicker",
//	  todayText: "Now",
//	  timeLabel: 'Time'
//  });

Ext.define('Fleet5.ux.dt.DateTimePicker', {
    extend: 'Ext.picker.Date',
    alias: 'widget.datetimepicker',
    okText: F.C.BtnOk,
    clearText: F.C.Clear,
    requires: ['Fleet5.ux.dt.TimePickerField'],

    initComponent: function () {
        // keep time part for value
        var value = this.value;
        if (Ext.isEmpty(value)) {
            var dt = new Date();
            if (this.isStartDay) {
                value = Ext.Date.parse(Ext.Date.format(dt, 'Y-m-d 00:00:00'),
                    "Y-m-d H:i:s");
            } else if (this.isEndDay) {
                value = Ext.Date.parse(Ext.Date.format(dt, 'Y-m-d 23:59:59'),
                        "Y-m-d H:i:s");
            } else {
                value = dt;
            }
        }
        this.callParent();
        this.value = value;
    },
    onRender: function (container, position) {
        if (!this.timefield) {
            this.timefield = Ext.create('Fleet5.ux.dt.TimePickerField', {
                hiddenLabel: true,
                labelWidth: 36,
                value: Ext.Date.format(this.value, 'H:i:s')
            });
        }
        this.timefield.ownerCt = this;
        this.timefield.on('change', this.timeChange, this);
        this.callParent(arguments);

        var table = Ext.get(Ext.DomQuery.selectNode('table', this.el.dom));
        var tfEl = Ext.core.DomHelper.insertAfter(table, {
            tag: 'div',
            style: 'border:0px;',
            children: [{
                tag: 'div',
                cls: 'x-datepicker-footer ux-timefield'
            }, {
                tag: 'div',
                cls: 'x-datepicker-footer',
                children: [{
                    tag: 'span',
                    cls: 'ux-okbtn'
                }, {
                    tag: 'span',
                    cls: 'ux-clearbtn'
                }]
            }]
        }, true);
        this.timefield.render(this.el.child('div div.ux-timefield'));

        var p = this.getEl().parent('div.x-layer');
        if (p) {
            p.setStyle("height", p.getHeight() + 31);
        }
        this.okBtn = Ext.create('Ext.button.Button', {
            text: this.okText,
            handler: this.selectOk,
            scope: this
        });
        this.okBtn.render(this.el.child('div span.ux-okbtn'));
        this.clearBtn = Ext.create('Ext.button.Button', {
            text: this.clearText,
            handler: this.clearDateTime,
            scope: this
        });
        this.clearBtn.render(this.el.child('div span.ux-clearbtn'));
    },
    // listener 时间域修改, timefield change
    timeChange: function (tf, time, rawtime) {
        // if(!this.todayKeyListener) { // before render
        this.value = this.fillDateTime(this.value);
        // } else {
        // this.setValue(this.value);
        // }
    },
    // @private
    fillDateTime: function (value) {
        if (this.timefield) {
            var rawtime = this.timefield.getRawValue();
            value.setHours(rawtime.h);
            value.setMinutes(rawtime.m);
            value.setSeconds(rawtime.s);
        }
        return value;
    },
    // @private
    changeTimeFiledValue: function (value) {
        this.timefield.un('change', this.timeChange, this);
        this.timefield.setValue(this.value);
        this.timefield.on('change', this.timeChange, this);
    },

    /* TODO 时间值与输入框绑定, 考虑: 创建this.timeValue 将日期和时间分开保存. */
    // overwrite
    setValue: function (value) {
        this.value = value;
        this.changeTimeFiledValue(value);
        return this.update(this.value);
    },
    // overwrite
    getValue: function () {
        return this.fillDateTime(this.value);
    },

    // overwrite : fill time before setValue
    handleDateClick: function (e, t) {
        var me = this,
			  handler = me.handler;

        e.stopEvent();
        if (!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
            me.doCancelFocus = me.focusOnSelect === false;
            me.setValue(this.fillDateTime(new Date(t.dateValue))); // overwrite: fill time before setValue
            delete me.doCancelFocus;
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
    },

    // overwrite : fill time before setValue
    selectToday: function () {
        var me = this,
			  btn = me.todayBtn,
			  handler = me.handler;

        if (btn && !btn.disabled) {
            // me.setValue(Ext.Date.clearTime(new Date())); //src
            me.setValue(new Date()); // overwrite: fill time before setValue
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;
    },

    selectOk: function () {
        var me = this,
			  btn = me.okBtn,
			  handler = me.handler;

        if (btn && !btn.disabled) {
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;

    },

    clearDateTime: function () {
        var me = this,
			  btn = me.clearBtn,
			  handler = me.handler;
        if (btn && !btn.disabled) {
            me.fireEvent('clearValue', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;

    }
});
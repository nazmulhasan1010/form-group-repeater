let css = {
    mainCard: {
        'border-radius': ' 10px',
        'border': '2px solid rgba(51, 51, 51, 0.73)',
        'margin': '10px 0',
        'padding': '10px',
        'display': 'flex',
        'justify-content': 'center'
    },

    inputField: {
        'padding': '10px',
        'font-size': '18px',
        'background': 'none',
        'outline': 'none',
        'border': '1px solid rgba(51, 51, 51, 0.73)',
        'border-radius': '5px',
        'margin': '10px'
    },
    deleteBtn: {
        'padding': '10px',
        'font-size': '18px',
        'outline': 'none',
        'border': '1px solid rgba(51, 51, 51, 0.73)',
        'border-radius': '5px',
        'background-color': '#ea1818',
        'color': '#fff',
        'margin': '10px'
    },
    disable: {
        'background-color': '#ef4d4d',
        'color': '#fff',
    }
};

jQuery.fn.extend({
    formGroup: function (options = {}) {
        let source = $(this),
            itemForData = $(this).children('[data-groupItem="group-item"]'),
            items = source.children('[data-groupItem="group-item"]'),
            groupIndex = 0,
            groupData = [],
            inputs = items.find('input'),
            dataType,
            style;
        // defaults
        if (options.dataType) {
            dataType = options.dataType;
        } else {
            dataType = 'submit-form-data';
        }
        if (options.style) {
            style = options.style;
        } else {
            style = 'default';
        }

        // add new item
        function addMoreItem() {
            // if dataType is data-array
            let disabled;
            if (groupIndex === 0) {
                disabled = 'disabled';
            }
            let deleteBtn = '<button type="button" data-delete="delete" class="" ' + disabled + '>Delete</button>';
            if (dataType === 'data-array') {
                let newItem = '<div class="groupModal" data-groupItem="group-item">' + items.html() + deleteBtn + '</div>';
                source.append(newItem);
                itemForData = $(this).children('[data-groupItem="group-item"]')
                groupIndex++;
            }
            // if dataType is submit-form-data
            if (dataType === 'submit-form-data') {
                let groupName;
                if ($(items).attr('groupName') != null) {
                    groupName = $(items).attr('groupName');
                } else {
                    groupName = 'group';
                }
                inputs.each(function (index, input) {
                    let className = inputs.eq(0).attr('class');
                    $(input).attr('name', groupName + '[' + groupIndex + '][' + $(input).data('name') + ']').attr('class', '');
                    if (options.style === 'custom') {
                        $(input).addClass(className);
                    }
                })
                let newItem = '<div class="groupModal">' + items.html() + deleteBtn + '</div>';
                source.append(newItem);
                groupIndex++;
            }
            $('[data-delete="delete"]').click(function () {
                $(this).parent('.groupModal').remove();
            });
            if (style === 'default') {
                let groupModal = $('.groupModal');
                groupModal.css(css.mainCard);
                groupModal.find('input').css(css.inputField);
                groupModal.find('[data-delete="delete"]').css(css.deleteBtn);
                $('button[disabled]').css(css.disable);
            } else if (style === 'custom') {
                let groupModal = $('.groupModal');
                if (options.css) {
                    groupModal.find('input').css(options.css)
                }
                groupModal.addClass(items.attr('class'));
                groupModal.find('[data-delete="delete"]').css(css.deleteBtn);
                $('button[disabled]').css(css.disable);
            }
        }

        if (groupIndex === 0 && options.fresh !== 'yes') {
            source.empty();
            addMoreItem();
        }
        $('[data-addButton="add-button"]').click(function (e) {
            e.preventDefault()
            addMoreItem()
        });

        // group data get a array format
        function dataGroup() {
            let inputData = itemForData.find('input'),
                randData = [],
                groupMembers = itemForData.eq(0).children('input').length;
            let member = groupMembers;
            for (let i = 0; i < inputData.length + 1; i++) {
                let data = inputData.eq(i).val();
                if (i === member) {
                    member = member + groupMembers;
                    groupData.push(randData);
                    randData = [];
                }
                randData[inputData.eq(i).data("name")] = data;
            }
        }

        // return group data
        if (options.dataType === 'data-array') {
            dataGroup();
            return groupData;
        }
    }
});

// get data as an array
function getData(main) {
    return main.formGroup({
        dataType: 'data-array',
        'fresh': 'yes'
    });
}

// execute function
var main = $('[data-formGroup="formGroup"]');
main.formGroup({
    // dataType: 'submit-form-data',
    // dataType: 'data-array',
    style: 'default',
    // style: 'custom',
    css: {
        'background-color': '#fff',
        'height': '30px',
        'margin': '5px',
    }
});
$('.getData').click(function () {
    let data = getData($('[data-formGroup="formGroup"]'));
    console.log(data)
});
$(function() {
    $('[data-datepicker=separateRange]').daterangepicker({
        autoUpdateInput: false,
        startDate: moment().startOf('days'),
        endDate: moment().startOf('days').add(3, 'days'),
        minDate: moment().startOf('days'),
        opens: 'center',
        locale: {
            cancelLabel: 'Clear'
        }
    });

    $('[data-datepicker=separateRange]').on('apply.daterangepicker', function(ev, picker) {
        $('input[name="start_date"]').val(picker.startDate.format('MM/DD/YYYY'));
        $('input[name="end_date"]').val(picker.endDate.format('MM/DD/YYYY'));
    });


    $('[data-datepicker=separateRange]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    })
});
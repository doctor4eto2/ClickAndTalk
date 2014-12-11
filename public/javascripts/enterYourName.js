(function () {
    $('#btnEnterYourName').click(function () {
        var name = $('#txtEnterYourName').val();
        
        if (name == '') {
            alert('Please enter your name!');
        }
        else { 
            window.location = $('#hdnEnterYourNamePrevousRequestUrl').val() + '&&userName=' + name;
        }
    });
})();
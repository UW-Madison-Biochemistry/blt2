$(document).ready(function() {
    // Get the modal for Package
    var packageModal = $("#packageModal");

    // Get the id for the each of the select2 dropdown boxes
    var select2Shipper = $("#select2-Shipper");
    var select2Vendor = $("#select2-Vendor");
    var select2Receiver = $("#select2-Receiver");

    // Get the input text box for number of packages
    var numberOfPackages = $('#numberOfPackages');

    // Get the input file
    var uploadFiles = $("#uploadFiles");
    // Set up the deleted packing slips array
    var deletedPackingSlips = [];

    // Get the div for existing packing slips
    var listOfExistingPackingSlips = $("#listOfExistingPackingSlips");

    // Set up noty
    var n = null;

    // Set up the form data
    var formData = null;

    // Set the dropdownParent for all select2 on this page to the package modal
    $.fn.select2.defaults.set("dropdownParent", $("#packageModal"));

    // When the select2 items are selected
    select2Shipper.on("select2:select", function() {
        select2Vendor.select2("open");
    });

    select2Vendor.on("select2:select", function() {
        select2Receiver.select2("open");
    });

    packageModal.on("show.bs.modal", function() {
        // When the dialogForm opens, check to see if it is an existing packageObject.
        // If so then show the shipper select2 div, create a new packageObject and fill the information
        if (window.newPackage === false) {
            // Display the shipper select2
            $(".existingPackage").show();

            // Hide the currently selected shipper
            $(".newPackage").hide();

            // Set the tracking number
            $("#packageTrackingNumber").text(window.existingPackageObject.trackingNumber);

            // Fill in the select2 inputs
            var shipperOption = new Option(window.existingPackageObject.shipper.name, window.existingPackageObject.shipper.id);
            select2Shipper.html(shipperOption).trigger("change");

            var vendorOption = new Option(window.existingPackageObject.vendor.name, window.existingPackageObject.vendor.id);
            select2Vendor.html(vendorOption).trigger("change");

            var receiverOption = new Option(window.existingPackageObject.receiver.name  + ' | ' + window.existingPackageObject.receiver.deliveryRoom, window.existingPackageObject.receiver.id);
            select2Receiver.html(receiverOption).trigger("change");

            // Set the number of packageObjects
            numberOfPackages.val(window.existingPackageObject.numberOfPackages);

            // If the packageObject has packing slips, set up preview links
            if (window.existingPackageObject.packingSlips.length > 0) {
                window.existingPackageObject.packingSlips.forEach(function (element, index, array) {

                    listOfExistingPackingSlips.append(
                        '<div id="' + element['id']+ '" class="form-control-static input-group col-md-3">' +
                        '<a class="btn btn-default btn-xs" data-id="'+ element['id'] + '" role="button" href="preview/' + element['downloadLink']  + '" target="_blank" tabindex="-1">Link</a>' +
                        '<div class="input-group-btn">' +
                        '<button type="button" data-id="' + element['id'] + '" class="btn btn-danger btn-xs deleteExistingPackingSlip" tabindex="-1">X</button>' +
                        '</div>' +
                        '</div>'
                    );
                });
            } else {
                // Hide the shipper select2 input
                $("#existingPackingSlips").hide();
            }

        } else { // Package being edited is a new package
            // Hide the shipper select2 input
            $(".existingPackage").hide();

            // Show the currently selected shipper
            $(".newPackage").show();

            // Get the tracking number
            var trackingNumber = $("#trackingNumberInput").val();

            var shipperSpan = $("#shipperSpan");

            $("#packageShipper").text(shipperSpan.text());

            // Set the tracking number in form
            $("#packageTrackingNumber").text(trackingNumber);
        }
    });

    packageModal.on("shown.bs.modal", function() {
        if (!window.newPackage) {
            select2Shipper.select2("open");
        } else {
            select2Vendor.select2("open");
        }
    });

    packageModal.on("hidden.bs.modal", function() {
        clearForm();

        var location = window.location.href.toString().split("/");

        if (location[location.length - 1] == "receiving" || location[location.length - 1] == "receiving#") {
            $("#trackingNumberInput").val("");
            $("#trackingNumberInput").focus();
        }
    });

    $("#noPackingSlipsModal").on("shown.bs.modal", function() {
        // If new package modal is shown, increase the z-index so that this modal is on top of the new package modal
        if ($("#packageModal").hasClass("in")) {
            $("#noPackingSlipsModal").css("z-index", parseInt($("#packageModal").css("z-index")) + 30);
        }
    });

    $("#submitPackage").on("click", function() {
        // Get the elements
        var shipperSpan = $("#shipperSpan");

        formData = new FormData(document.getElementById('uploadFiles'));

        if (!window.newPackage) {
            if (select2Shipper.val() === null) {
                addError("shipper");
                select2Shipper.select2('open');
                return;
            } else {
                formData.append("shipperId", select2Shipper.val());
                deletedPackingSlips.forEach(function(val, index) {
                    formData.append("deletePackingSlipIds[]", val);
                });
            }
        } else {
            formData.append("trackingNumber", $("#packageTrackingNumber").text());
            formData.append("shipperId", shipperSpan.attr('value'));
        }

        if (select2Vendor.val() === null) {
            addError("vendor");
            select2Vendor.select2('open');
            return;
        } else {
            formData.append("vendorId", select2Vendor.val());
        }

        if (select2Receiver.val() === null) {
            addError("receiver");
            select2Receiver.select2('open');
            return;
        } else {
            formData.append("receiverId", select2Receiver.val());
        }

        if (parseInt($("#numberOfPackages").val()) < 0) {
            $("#addAPackage").focus();
            return;
        } else {
            formData.append("numberOfPackages", parseInt($("#numberOfPackages").val()));
        }

        // Get all pictures
        var picturesTaken = document.getElementsByClassName("thumbnail");

        if (picturesTaken.length > 0) {
            for (var i = 0; i < picturesTaken.length; i++) {
                formData.append("packingSlipPictures[]", picturesTaken[i].src);
            }
        }

        var emptyPackingSlips = false;
        var packingSlips = $("#attachedPackingSlips");
        var numberOfAttachedPackingSlips = packingSlips[0]['files'].length;

        if (numberOfAttachedPackingSlips < 1 && picturesTaken.length < 1) {
            emptyPackingSlips = true;
        }

        if (emptyPackingSlips) {
            $("#noPackingSlipsModal").modal({
                backdrop: "static"
            });
        } else {
            sendFormData();
        }
    });


    $("#confirmedNoPackingSlipsIsOkay").on("click", function() {
        sendFormData();
    });

    // When the user clicks on the "-" next to the number of packageObjects text input box, decrease the number in the text box by one
    $("#minusAPackage").click(function() {
        var numberOfPackages = document.getElementById("numberOfPackages");
        var numValue = parseInt(numberOfPackages.value, 10);
        if (numValue > 1) {
            numberOfPackages.value = numValue - 1;
        }
    });


    // When the user clicks on the "+" next to the number of packageObjects text input box, increase the number in the text box by one
    $("#addAPackage").click(function() {
        var numberOfPackages = document.getElementById("numberOfPackages");
        var numValue = parseInt(numberOfPackages.value, 10);
        numberOfPackages.value = numValue + 1;
    });

    /*
     * Remove the selected input type file. If it's the only one, then just remove the input element and add a new one.
     */
    $(document).on("click", "#clearAttachedPackingSlips", function() {
        $("#attachedPackingSlips").val("");
    });

    /*
     * Delete existing packing slip
     */
    $(document).on("click", ".deleteExistingPackingSlip", function() {
        var idOfPackingSlip = $(this).data('id');

        $("#" + idOfPackingSlip).remove();

        deletedPackingSlips.push(idOfPackingSlip);

        // If the list is empty, hide the label/div
        if ($(".deleteExistingPackingSlip").length == 0) {
            // Hide the shipper select2 input
            $("#existingPackingSlips").hide();
        }
    });

    /**
     * Clear the form
     */
    function clearForm() {
        // Remove any highlighted errors
        removeFormErrors();

        // Reset select2 hidden inputs
        select2Shipper.val(null).trigger("change");
        select2Vendor.val(null).trigger("change");
        select2Receiver.val(null).trigger("change");

        formData = null;
        
        // Set the number of packageObjects to 1
        numberOfPackages.val(1);

        // Remove all existing packing slips from the previous packageObject, if any
        $("#listOfExistingPackingSlips").empty();

        // Clear imput type file
        $("#attachedPackingSlips").val("");

        // Remove all images
        $('.thumbnail').remove();
        $("#image").src = '';
        $("#thumbnailsDiv").empty();

        // Change newPackage flag to true
        window.newPackage = true;

        // Clear any deleted packing slips from updates
        deletedPackingSlips = [];
    }

    // If the up/down arrow keys are pressed, add or subtract the number of packageObjects
    $(document).keyup(function(e) {
        if (!($(".select2-input").is(":visible"))) {
            if (e.keyCode == 38) {
                $("#addAPackage").click();
            } else if (e.keyCode == 40) {
                $("#minusAPackage").click();
            }
        }
    });

    function sendFormData() {
        if (window.newPackage) {
            // Upload form VIA AJAX POST
            $.ajax({
                url: 'packages/new',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false
            })
                .done(function (results) {
                    // If the result is an error, display the error and close the form as the form has already been submitted
                    if (results['result'] == 'error') {
                        n = noty({
                            layout: "top",
                            theme: "bootstrapTheme",
                            type: "error",
                            text: results['message'],
                            maxVisible: 2,
                            timeout: 2000,
                            killer: true,
                            buttons: false
                        });
                    } else {
                        if ((results['result'] == 'success') && (results['object'] !== null)) {
                            // Add a row to the current table with the last uploaded packageObject information
                            $('#datatable-Receiving').DataTable().row.add(results['object']).draw();

                            // Display a noty notification towards the bottom telling the user that the packageObject information was submitted successfully
                            n = noty({
                                layout: "top",
                                theme: "bootstrapTheme",
                                type: "success",
                                text: "Package information sent successfully!",
                                maxVisible: 2,
                                timeout: 2000,
                                killer: true,
                                buttons: false
                            });
                        }
                    }
                })
                .fail(function () {
                    // Display a noty telling the user that there was an issue submitting the packageObject information
                    n = noty({
                        layout: "top",
                        theme: "bootstrapTheme",
                        type: "error",
                        text: "Connection error; please try again",
                        maxVisible: 2,
                        timeout: 2000,
                        killer: true,
                        buttons: false
                    });
                });
        } else { // Update package VIA POST
            $.ajax({
                url: 'packages/' + window.existingPackageObject.trackingNumber + '/update',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false
            })
                .done(function (results) {
                    // If the result is an error, display the error and close the form as the form has already been submitted
                    if (results['result'] == 'error') {
                        n = noty({
                            layout: "top",
                            theme: "bootstrapTheme",
                            type: "error",
                            text: results['message'],
                            maxVisible: 2,
                            timeout: 2000,
                            killer: true,
                            buttons: false
                        });
                    } else {
                        if ((results['result'] == 'success') && (results['object'] !== null)) {
                            // Display a noty notification towards the bottom telling the user that the packageObject information was submitted successfully
                            n = noty({
                                layout: "top",
                                theme: "bootstrapTheme",
                                type: "success",
                                text: results['message'],
                                maxVisible: 2,
                                timeout: 2000,
                                killer: true,
                                buttons: false
                            });

                            var location = window.location.href.toString().split("/");

                            if (location[location.length - 1] == "receiving" || location[location.length - 1] == "receiving#") {
                                // Depending on the returned object, either update the dataTable or ignore
                                var trackingNumberUpdated = results["object"]["trackingNumber"];

                                // Get the row index the row is on if any
                                // NOTICE: The DataTable constructor used here is "Hungarian" casing to use
                                // legacy plugins created for 1.9 and lower
                                var row = $('#datatable-Receiving').dataTable().fnFindCellRowIndexes(trackingNumberUpdated, 0);

                                if (row.length != 0) {
                                    $('#datatable-Receiving').DataTable().row(row).remove().row.add(results["object"]).draw();
                                }
                            }

                        }
                    }
                })
                .fail(function () {
                    // Display a noty telling the user that there was an issue submitting the packageObject information
                    n = noty({
                        layout: "top",
                        theme: "bootstrapTheme",
                        type: "error",
                        text: "Connection error; please try again",
                        maxVisible: 2,
                        timeout: 2000,
                        killer: true,
                        buttons: false
                    });
                });
        }

        // Close the form
        packageModal.modal("hide");
    }

    /**
     * Remove all form errors
     */
    function removeFormErrors() {
        $('#packageVendorDiv').removeClass('has-error');
        $('#packageReceiverDiv').removeClass('has-error');
        $('#packageShipperDiv').removeClass('has-error');
    }

    /**
     * When the user clicks on a thumbnail, ask the user to see if he/she wants to delete this image. If so, delete the
     * thumbnail and the hidden image.
     */
    $(document).on("click", ".thumbnail", function() {
        var confirmDelete = confirm("Are you sure you want to delete this image?");
        if (confirmDelete) {
            this.remove();
            var allThumbnails = document.getElementsByClassName("thumbnail").length;
            if (allThumbnails === 0) {
                $("#thumbnails").css("display", "none");
            }
        }

    });

    function addError(error) {
        if (error == "vendor") {
            $('#packageVendorDiv').addClass('has-error');
        } else if (error == "receiver") {
            $('#packageReceiverDiv').addClass('error');
        } else if (error == "shipper") {
            $('#packageShipperDiv').addClass('error');
        }

    }
});
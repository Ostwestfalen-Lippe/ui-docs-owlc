var OWLDatePicker = OWLDatePicker || {};
OWLDatePicker.parent = this;
OWLDatePicker.loadDatePicker = async function loadDatePicker(el, _dotNetRef) {

  var start = el.querySelector("input[type='date'].startdate");
  var end = el.querySelector("input[type='date'].enddate");
  var toggle = el.querySelector("button[data-toggle]");
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  var fp = flatpickr(el, {
      locale: "de",
      mode: "range",
      clickOpens: false,
      onClose: function (selectedDates, dateStr, instance) {
        if (!!selectedDates[0]) {
          selectedDates[0].setHours(2);
          start.value = selectedDates[0].toISOString().substr(0, 10);
          start.dispatchEvent(new Event('change'));
        }
        else{
          start.value = "";
          start.dispatchEvent(event);
        }
        if (!!selectedDates[1]) {
          selectedDates[1].setHours(2);
          end.value = selectedDates[1].toISOString().substr(0, 10);
          end.dispatchEvent(new Event('change'));
        }
        else{
          end.value = "";
          end.dispatchEvent(new Event('change'));
        }
      },
    });
  if (!isMobile) {
    start.onclick = function () {
      event.preventDefault();
      if (fp.isOpen) {
        fp.close();
      } else {
        fp.open();
      }
    };
    start.addEventListener('change', (event) => {
      if(!!start.value){
        fp.selectedDates[0] = new Date(start.value);
        fp.jumpToDate(fp.selectedDates[0]);
      }
    });
    end.onclick = function () {
      event.preventDefault();
      if (fp.isOpen) {
        fp.close();
      } else {
        fp.open();
      }
    };
    end.addEventListener('change', (event) => {
      if(!!end.value){
        fp.selectedDates[1] = new Date(end.value);
        fp.jumpToDate(fp.selectedDates[1]);
      }
    });
    // if(/Mozilla/i.test(navigator.userAgent))
    // // if(/(?=.*Mozilla)(?=.*(Linux|Windows|Macintosch))/i.test(navigator.userAgent))
    // {start.required=true; end.required=true;}
  }
  el.querySelector("button[data-clear]").onclick = function (event) {
      event.preventDefault();
      if (fp.isOpen) {
        fp.close();
      }
      fp.clear();
      start.value = "";
      end.value = "";
      start.dispatchEvent(new Event('change'));
      end.dispatchEvent(new Event('change'));
    };
  toggle.onclick = function (event) {
    event.preventDefault();
    if (fp.isOpen) {
      fp.close();
    } else {
      fp.open();
    }
  };

    return OWLUtils.storeObjectRef(fp);
}
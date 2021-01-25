
import $ from 'jquery';

function exported(){
    $(document).on("keydown", ".form-control", function(e){
        if (e.which === 13) {
          $(this).siblings('.btn').trigger("click");
        }
    });
}


export default exported;

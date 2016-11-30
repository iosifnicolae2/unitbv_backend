function Snackbar(text,duration) {
    var x = document.getElementById("snackbar")
    x.className = "show";
    x.innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, duration||3000);
}
$(function() {
$(document).on('change', ':file', function() {
   var input = $(this),
       numFiles = input.get(0).files ? input.get(0).files.length : 1,
       label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
   input.trigger('fileselect', [numFiles, label]);
 });

 $(document).ready( function() {
      $(':file').on('fileselect', function(event, numFiles, label) {

          var input = $(this).parents('.input-group').find(':text'),
              log = numFiles > 1 ? numFiles + ' files selected' : label;

          if( input.length ) {
              input.val(log);
          } else {
              if( log ) alert(log);
          }

      });
  });


  /* Create business schedule */
   $("#add_row").click(function(){
     console.log("add",schedule_count)
    $('#addr'+schedule_count).html("<td><input name='start_day"+schedule_count+"' type='number' class='form-control input-md'  /></td><td><input  name='end_day"+schedule_count+"' type='number'   class='form-control input-md'></td><td><input  name='start_hour"+schedule_count+"' type='time' step=60 class='form-control input-md'></td><td><input  name='end_hour"+schedule_count+"' type='time' class='form-control input-md'  step=60></td>");

    $('#tab_logic').append('<tr id="addr'+(schedule_count+1)+'"></tr>');
    schedule_count++;
    $( "#schedule_tbody" ).append( "<tr id='addr"+schedule_count+"'></tr>" );

    $("input#schedule_count").val(schedule_count);
});
   $("#delete_row").click(function(){
       if(schedule_count>0){
       $("#addr"+(schedule_count-1)).html('');
       schedule_count--;
       }
   });

});


$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results==null) return false;
    return results[1] || 0;
}
/* Show server messages */
if($.urlParam('user_deleted'))
Snackbar('User was deleted.');
else if($.urlParam('user_edited'))
Snackbar('User was edited.');
else if($.urlParam('business_edited'))
Snackbar('Business was edited.');
else if($.urlParam('gift_deleted'))
Snackbar('Gift was deleted.');
else if($.urlParam('trophey_deleted'))
Snackbar('Trophey was deleted.');
else if($.urlParam('trophey_edited'))
Snackbar('Trophey was deleted.');

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var account_id = getParameterByName('account_id') || 100700000
$.ajax({
  url: '/authorized-users/' + account_id
}).done((data) => {
  data.forEach((authorizedUser) => {
    if (authorizedUser.is_primary) {
      //todo: unspecified gender
      if (authorizedUser.gender === 'Male') {
        $('#user-container').prepend(`
        <div>
          <figure data-ix="new-interaction-7" class="imgpadre"></figure>
        </div>
          `);
      }
      else {
        $('#user-container').prepend(`
        <div>
          <figure data-ix="new-interaction-7" class="imgmadre"></figure>
        </div>
          `);

      }
    }
  });
});

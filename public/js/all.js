if (window.location.href.indexOf('choose-account') !== -1) {
$.ajax({
  url: '/list-accounts'
}).done((data) => {
  data.forEach((account) => {
    $('#list-accounts').prepend(`<a href="/?account_id=${account}">${account}</a><br />`);
  });
  console.log(data);
  });
}

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
var generateMainProfile = (className, userName) => {
return `<div class="mainProfileWrapper">
    <figure data-ix="new-interaction-7" class="${className}"></figure>
    <span class="mainProfileName">${userName}</span>
  </div>`;
};
var generateAuthorizedUserProfile = (gender, first_name, pos) => {
  let genderClass = '';
  let posClass = '';
  if (pos === 1) {
    posClass = 'hijo1 hijoefect hijomedio imghijo';
  }
  else if (pos === 2) {
    posClass = 'hijomedio hijoultimo imghijo';
  }
  else if (pos === 3) {
    posClass = 'h2 hijo2 hijoefect hijomedio im1 imghijo';
  }
  else if (pos === 4) {
    posClass = 'h4 hijomedio hjopenultimo imghijo';
  }
  else {
    posClass = 'hijomedio hijomedio1 im2 imghijo';
  }
  if (gender === 'Male') {
    genderClass = '';
  }
  else {
    genderClass = '';
  }
  return `<div data-ix="new-interaction-4" class="${genderClass} ${posClass}"></div>`;
};
$.ajax({
  url: '/authorized-users/' + account_id
}).done((data) => {
  data.forEach((authorizedUser, key) => {
    var userName = authorizedUser.first_name;
    if (authorizedUser.is_primary) {
      //todo: unspecified gender
      if (authorizedUser.gender === 'Male') {
        $('#user-container').prepend(generateMainProfile('imgpadre', userName));
      }
      else {
        $('#user-container').prepend(generateMainProfile('imgmadre', userName));
      }
    }
    else {
      //$('#authorized-user-container').prepend(generateAuthorizedUserProfile(authorizedUser.gender, authorizedUser.first_name, key + 1));
      $('#auth' + (key)).html('<span class="authUsername">' + userName);
    }
  });
});

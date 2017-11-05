if (window.location.href.indexOf('mygoal') !== -1) {
  var generateBudgetHTML = (budget, i) => {
    var generateIcon = (spent, max) => {
      if (spent / max < .5) {
        return 'happy';
      }
      else if (spent / max < 1) {
        return 'confused';
      }
      else {
        return 'sad-1';
      }
    };
      return `<div class="form-block-3 w-form">
          <form id="email-form-${i}" name="email-form-${i}" data-name="" class="form-${i}"><label for="" class="field-label-4">${budget.mcc_segment_description}</label>
            <div class="div-block-12 w-clearfix">
              <div class="text-block-5">$ ${budget.spentAmount} </div>
              <div class="text-block-5 txtbarra">/</div>
              <div class="text-block-6">$ ${budget.max_consume}</div>
              <div class="div-block-11">
                <img src="images/${generateIcon(budget.spentAmount, budget.max_consume)}.png" class="image-7">
              </div>
            </div>
          </form>
        </div>`;
  };
  var customer_id = localStorage.customer_id || 100730000;
  $.ajax({
    url: `/budget?customer_id=${customer_id}&date_from=09/01/2017&date_to=09/30/2017`
  }).done((budgetData) => {
    budgetData.forEach((budget, key) => {
      $('#mygoal-container').prepend(generateBudgetHTML(budget, key));
    });
  });
}
else if (window.location.href.indexOf('igoal') !== -1) {
  setTimeout(() => {
    var customer_id = parseInt(getParameterByName('customer_id'));
    JSON.parse(localStorage.authorizedUsers).forEach((user) => {
      if (user.customer_id === customer_id) {
        localStorage.customer_id = customer_id;
        $('#igoal-container').prepend(`
        <a href="#" data-ix="new-interaction-2" class="link-2 visible-link">${user.first_name}'s Goal</a>
        `);        
      }
    });
    //load the available merchant categories
    $.ajax({
      url: '/merchant-categories'
    }).done((categories) => {
      console.log(categories);
    });
  }, 500);
}
else if (window.location.href.indexOf('choose-account') !== -1) {
$.ajax({
  url: '/list-accounts'
}).done((data) => {
  data.forEach((account) => {
    $('#list-accounts').prepend(`<a href="/?account_id=${account}">${account}</a><br />`);
  });
  console.log(data);
  });
}
else {
  //the index page.
  localStorage.account_id = getParameterByName('account_id') || 100700000
  $.ajax({
    url: '/authorized-users/' + localStorage.account_id
  }).done((data) => {
    localStorage.authorizedUsers = JSON.stringify(data);
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
}

function goToGoal(pos) {
  var customer_id = JSON.parse(localStorage.authorizedUsers)[pos].customer_id;
  window.location.href = `/igoal?customer_id=${customer_id}&account_id=${localStorage.account_id}`;
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


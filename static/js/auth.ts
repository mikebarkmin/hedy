import { modal } from './modal';
import { join_class } from './teachers';
import { saveitP } from './app';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const countries: Record<string, string> = {'AF':'Afghanistan','AX':'Åland Islands','AL':'Albania','DZ':'Algeria','AS':'American Samoa','AD':'Andorra','AO':'Angola','AI':'Anguilla','AQ':'Antarctica','AG':'Antigua and Barbuda','AR':'Argentina','AM':'Armenia','AW':'Aruba','AU':'Australia','AT':'Austria','AZ':'Azerbaijan','BS':'Bahamas','BH':'Bahrain','BD':'Bangladesh','BB':'Barbados','BY':'Belarus','BE':'Belgium','BZ':'Belize','BJ':'Benin','BM':'Bermuda','BT':'Bhutan','BO':'Bolivia, Plurinational State of','BQ':'Bonaire, Sint Eustatius and Saba','BA':'Bosnia and Herzegovina','BW':'Botswana','BV':'Bouvet Island','BR':'Brazil','IO':'British Indian Ocean Territory','BN':'Brunei Darussalam','BG':'Bulgaria','BF':'Burkina Faso','BI':'Burundi','KH':'Cambodia','CM':'Cameroon','CA':'Canada','CV':'Cape Verde','KY':'Cayman Islands','CF':'Central African Republic','TD':'Chad','CL':'Chile','CN':'China','CX':'Christmas Island','CC':'Cocos (Keeling) Islands','CO':'Colombia','KM':'Comoros','CG':'Congo','CD':'Congo, the Democratic Republic of the','CK':'Cook Islands','CR':'Costa Rica','CI':'Côte d\'Ivoire','HR':'Croatia','CU':'Cuba','CW':'Curaçao','CY':'Cyprus','CZ':'Czech Republic','DK':'Denmark','DJ':'Djibouti','DM':'Dominica','DO':'Dominican Republic','EC':'Ecuador','EG':'Egypt','SV':'El Salvador','GQ':'Equatorial Guinea','ER':'Eritrea','EE':'Estonia','ET':'Ethiopia','FK':'Falkland Islands (Malvinas)','FO':'Faroe Islands','FJ':'Fiji','FI':'Finland','FR':'France','GF':'French Guiana','PF':'French Polynesia','TF':'French Southern Territories','GA':'Gabon','GM':'Gambia','GE':'Georgia','DE':'Germany','GH':'Ghana','GI':'Gibraltar','GR':'Greece','GL':'Greenland','GD':'Grenada','GP':'Guadeloupe','GU':'Guam','GT':'Guatemala','GG':'Guernsey','GN':'Guinea','GW':'Guinea-Bissau','GY':'Guyana','HT':'Haiti','HM':'Heard Island and McDonald Islands','VA':'Holy See (Vatican City State)','HN':'Honduras','HK':'Hong Kong','HU':'Hungary','IS':'Iceland','IN':'India','ID':'Indonesia','IR':'Iran, Islamic Republic of','IQ':'Iraq','IE':'Ireland','IM':'Isle of Man','IL':'Israel','IT':'Italy','JM':'Jamaica','JP':'Japan','JE':'Jersey','JO':'Jordan','KZ':'Kazakhstan','KE':'Kenya','KI':'Kiribati','KP':'Korea, Democratic People\'s Republic of','KR':'Korea, Republic of','KW':'Kuwait','KG':'Kyrgyzstan','LA':'Lao People\'s Democratic Republic','LV':'Latvia','LB':'Lebanon','LS':'Lesotho','LR':'Liberia','LY':'Libya','LI':'Liechtenstein','LT':'Lithuania','LU':'Luxembourg','MO':'Macao','MK':'Macedonia, the Former Yugoslav Republic of','MG':'Madagascar','MW':'Malawi','MY':'Malaysia','MV':'Maldives','ML':'Mali','MT':'Malta','MH':'Marshall Islands','MQ':'Martinique','MR':'Mauritania','MU':'Mauritius','YT':'Mayotte','MX':'Mexico','FM':'Micronesia, Federated States of','MD':'Moldova, Republic of','MC':'Monaco','MN':'Mongolia','ME':'Montenegro','MS':'Montserrat','MA':'Morocco','MZ':'Mozambique','MM':'Myanmar','NA':'Namibia','NR':'Nauru','NP':'Nepal','NL':'Netherlands','NC':'New Caledonia','NZ':'New Zealand','NI':'Nicaragua','NE':'Niger','NG':'Nigeria','NU':'Niue','NF':'Norfolk Island','MP':'Northern Mariana Islands','NO':'Norway','OM':'Oman','PK':'Pakistan','PW':'Palau','PS':'Palestine, State of','PA':'Panama','PG':'Papua New Guinea','PY':'Paraguay','PE':'Peru','PH':'Philippines','PN':'Pitcairn','PL':'Poland','PT':'Portugal','PR':'Puerto Rico','QA':'Qatar','RE':'Réunion','RO':'Romania','RU':'Russian Federation','RW':'Rwanda','BL':'Saint Barthélemy','SH':'Saint Helena, Ascension and Tristan da Cunha','KN':'Saint Kitts and Nevis','LC':'Saint Lucia','MF':'Saint Martin (French part)','PM':'Saint Pierre and Miquelon','VC':'Saint Vincent and the Grenadines','WS':'Samoa','SM':'San Marino','ST':'Sao Tome and Principe','SA':'Saudi Arabia','SN':'Senegal','RS':'Serbia','SC':'Seychelles','SL':'Sierra Leone','SG':'Singapore','SX':'Sint Maarten (Dutch part)','SK':'Slovakia','SI':'Slovenia','SB':'Solomon Islands','SO':'Somalia','ZA':'South Africa','GS':'South Georgia and the South Sandwich Islands','SS':'South Sudan','ES':'Spain','LK':'Sri Lanka','SD':'Sudan','SR':'Suriname','SJ':'Svalbard and Jan Mayen','SZ':'Swaziland','SE':'Sweden','CH':'Switzerland','SY':'Syrian Arab Republic','TW':'Taiwan, Province of China','TJ':'Tajikistan','TZ':'Tanzania, United Republic of','TH':'Thailand','TL':'Timor-Leste','TG':'Togo','TK':'Tokelau','TO':'Tonga','TT':'Trinidad and Tobago','TN':'Tunisia','TR':'Turkey','TM':'Turkmenistan','TC':'Turks and Caicos Islands','TV':'Tuvalu','UG':'Uganda','UA':'Ukraine','AE':'United Arab Emirates','GB':'United Kingdom','US':'United States','UM':'United States Minor Outlying Islands','UY':'Uruguay','UZ':'Uzbekistan','VU':'Vanuatu','VE':'Venezuela, Bolivarian Republic of','VN':'Viet Nam','VG':'Virgin Islands, British','VI':'Virgin Islands, U.S.','WF':'Wallis and Futuna','EH':'Western Sahara','YE':'Yemen','ZM':'Zambia','ZW':'Zimbabwe'};

export interface Profile {
  session_expires_at: number;
}

interface User {
  username?: string;
  email?: string;
  password?: string;
  birth_year?: number;
  country?: string;
  gender?: string;
  subscribe?: string;
  prog_experience?: 'yes' | 'no';
  experience_languages?: string[];
  is_teacher?: string;
}

interface UserForm {
  username?: string;
  email?: string;
  password?: string;
  birth_year?: string;
  country?: string;
  gender?: string;
  subscribe?: string;
  mail_repeat?: string;
  password_repeat?: string;
  old_password?: string;
}

const chart_colors = ["#fd7f6f", "#b2e061", "#7eb0d5", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"]

if (!(window as any).AuthMessages) {
  throw new Error('On a page where you load this JavaScript, you must also load the "client_messages.js" script');
}

export const auth = {
  texts: AuthMessages,
  profile: undefined as (Profile | undefined),
  reset: undefined as (Record<string, string> | undefined),
  entityify: function (string: string) {
      return string.replace (/&/g, '&amp;').replace (/</g, '&lt;').replace (/>/g, '&gt;').replace (/"/g, '&quot;').replace (/'/g, '&#39;').replace (/`/g, '&#96;');
   },
  emailRegex: /^(([a-zA-Z0-9_+\.\-]+)@([\da-zA-Z\.\-]+)\.([a-zA-Z\.]{2,6})\s*)$/,
  redirect: function (where: string) {
    where = '/' + where;
    window.location.pathname = where;
  },
  logout: function () {
    $.ajax ({type: 'POST', url: '/auth/logout'}).done (function () {
      auth.redirect ('login');
    });
  },
  destroy: function () {
    modal.confirm (auth.texts['are_you_sure'], function () {
      $.ajax ({type: 'POST', url: '/auth/destroy'}).done (function () {
        auth.redirect ('');
      });
    });
  },
  error: function (message: string, element?: string | null, id?: string) {
    $ (id || '#error').html (message);
    $ (id || '#error').css ('display', 'block');
    if (element) $ ('#' + element).css ('border', 'solid 1px red');
  },
  clear_error: function (id?: string) {
    $ (id || '#error').html ('');
    $ (id || '#error').css ('display', 'none');
    $ ('form *').css ('border', '');
  },
  success: function (message: string, id?: string) {
    $ ('#error').css ('display', 'none');
    $ (id || '#success').html (message);
    $ (id || '#success').css ('display', 'block');
  },
  submit: function (op: string) {
    const values: UserForm = {};
    $ ('form.js-validated-form *').map (function (_k, el) {
      if (el.id) values[el.id as keyof UserForm] = (el as HTMLInputElement).value;
    });

    if (op === 'signup') {
      if (! values.username) return auth.error (auth.texts['please_username'], 'username');
      values.username = values.username.trim ();
      if (values.username.length < 3) return auth.error (auth.texts['username_three'], 'username');
      if (values.username.match (/:|@/)) return auth.error (auth.texts['username_special'], 'username');

      if (! values.email?.match (auth.emailRegex)) return auth.error (auth.texts['valid_email'], 'email');
      if (values.email !== values.mail_repeat) return auth.error (auth.texts['repeat_match_email'],    'mail_repeat');

      if (! values.password) return auth.error (auth.texts['please_password'], 'password');
      if (values.password.length < 6) return auth.error (auth.texts['password_six'], 'password');
      if (values.password !== values.password_repeat) return auth.error (auth.texts['repeat_match_password'], 'password_repeat');

      if (values.birth_year) {
        if (!validBirthYearString(values.birth_year)) {
           return auth.error (auth.texts['valid_year'] + new Date ().getFullYear (), 'birth_year');
        }
      }

      const payload: User = {
        username: values.username,
        email: values.email,
        password: values.password,
        birth_year: values.birth_year ? parseInt(values.birth_year) : undefined,
        country: values.country ? values.country : undefined,
        gender: values.gender ? values.gender : undefined,
        subscribe: $('#subscribe').prop('checked'),
        is_teacher: $('#is_teacher').prop('checked'),
        prog_experience: $('input[name=has_experience]:checked').val() as 'yes'|'no',
        experience_languages: $('#languages').is(':visible')
          ? $('input[name=languages]').filter(':checked').map((_, box) => $(box).val() as string).get()
          : undefined,
      };

      $.ajax ({type: 'POST', url: '/auth/signup', data: JSON.stringify (payload), contentType: 'application/json; charset=utf-8'}).done (function () {
        auth.success (auth.texts['signup_success']);

        // We set up a non-falsy profile to let `saveit` know that we're logged in. We put session_expires_at since we need it.
        auth.profile = {session_expires_at: Date.now () + 1000 * 60 * 60 * 24};

        afterLogin();
      }).fail (function (response) {
        const error = response.responseText || '';
        if (error.match ('email'))         auth.error (auth.texts['exists_email']);
        else if (error.match ('username')) auth.error (auth.texts['exists_username']);
        else                               auth.error (auth.texts['ajax_error']);
      });
    }

    if (op === 'login') {
      if (! values.username) return auth.error (auth.texts['please_username_email'], 'username');
      if (! values.password) return auth.error (auth.texts['please_password'], 'password');

      auth.clear_error ();
      $.ajax ({type: 'POST', url: '/auth/login', data: JSON.stringify ({username: values.username, password: values.password}), contentType: 'application/json; charset=utf-8'}).done (function () {

        // We set up a non-falsy profile to let `saveit` know that we're logged in. We put session_expires_at since we need it.
        auth.profile = {session_expires_at: Date.now () + 1000 * 60 * 60 * 24};

        afterLogin();
      }).fail (function (response) {
        if (response.status === 403) {
           auth.error (auth.texts['invalid_username_password'] + ' ' + auth.texts['no_account'] + ' &nbsp;<button class="green-btn" onclick="auth.redirect (\'signup\')">' + auth.texts['create_account'] + '</button>');
           $ ('#create-account').hide ();
           localStorage.setItem ('hedy-login-username', values.username ?? '');
        }
        else auth.error (auth.texts['ajax_error']);
      });
    }

    if (op === 'profile') {
      if (! (values.email ?? '').match (auth.emailRegex)) return auth.error (auth.texts['valid_email'], 'email');

      if (values.birth_year) {
        if (!validBirthYearString(values.birth_year)) {
          return auth.error (auth.texts['valid_year'] + new Date ().getFullYear (), 'birth_year');
        }
      }

      const payload: User = {
        email: values['email'],
        birth_year: values.birth_year ? parseInt(values['birth_year']) : undefined,
        country: values['country'],
        gender: values['gender'],
        prog_experience: $ ('input[name=has_experience]:checked').val() as 'yes' | 'no',
        experience_languages: $('#languages').is(':visible')
          ? $('input[name=languages]').filter(':checked').map((_, box) => $(box).val() as string).get()
          : undefined,
      };

      console.log(payload);

      auth.clear_error ();
      $.ajax ({type: 'POST', url: '/profile', data: JSON.stringify (payload), contentType: 'application/json; charset=utf-8'}).done (function () {
        auth.success (auth.texts['profile_updated']);
      }).fail (function (response) {
        auth.error (auth.texts['ajax_error'] + ' ' + response.responseText);
      });
    }

    if (op === 'change_password') {
      if (! values.password) return auth.error (auth.texts['please_password'], 'password', '#error-password');
      if (values.password.length < 6) return auth.error (auth.texts['password_six'], 'password', '#error-password');
      if (values.password !== values.password_repeat) return auth.error (auth.texts['repeat_match'], 'password_repeat', '#error-password');

      const payload = {old_password: values.old_password, new_password: values.password};

      auth.clear_error ('#error-password');
      $.ajax ({type: 'POST', url: '/auth/change_password', data: JSON.stringify (payload), contentType: 'application/json; charset=utf-8'}).done (function () {
        auth.success (auth.texts['password_updated'], '#success-password');
        $ ('#old_password').val ('');
        $ ('#password').val ('');
        $ ('#password_repeat').val ('');
      }).fail (function (response) {
        if (response.status === 403) auth.error (auth.texts['invalid_password'], null, '#error-password');
        else                         auth.error (auth.texts['ajax_error'], null, '#error-password');
      });
    }

    if (op === 'recover') {
      if (! values.username) return auth.error (auth.texts['please_username'], 'username');

      const payload = {username: values.username};

      auth.clear_error ();
      $.ajax ({type: 'POST', url: '/auth/recover', data: JSON.stringify (payload), contentType: 'application/json; charset=utf-8'}).done (function () {
        auth.success (auth.texts['sent_password_recovery']);
        $ ('#username').val ('');
      }).fail (function (response) {
        if (response.status === 403) auth.error (auth.texts['invalid_username']);
        else                         auth.error (auth.texts['ajax_error']);
      });
    }

    if (op === 'reset') {
      if (! values.password) return auth.error (auth.texts['please_password'], 'password');
      if (values.password.length < 6) return auth.error(auth.texts['password_six'], 'password');
      if (values.password !== values.password_repeat) return auth.error (auth.texts['repeat_match'], 'password_repeat');

      const payload = {username: auth.reset?.['username'], token: auth.reset?.['token'], password: values.password};

      auth.clear_error ();
      $.ajax ({type: 'POST', url: '/auth/reset', data: JSON.stringify (payload), contentType: 'application/json; charset=utf-8'}).done (function () {
        auth.success (auth.texts['password_resetted']);
        $ ('#password').val ('');
        $ ('#password_repeat').val ('');
        delete auth.reset;
        auth.redirect ('login');
      }).fail (function (response) {
        if (response.status === 403) auth.error (auth.texts['invalid_reset_link']);
        else                         auth.error (auth.texts['ajax_error']);
      });
    }
  },
  markAsTeacher: function (username: string, is_teacher: boolean) {
    $.ajax ({type: 'POST', url: '/admin/markAsTeacher', data: JSON.stringify ({username: username, is_teacher: is_teacher}), contentType: 'application/json; charset=utf-8'}).done (function () {
      modal.alert (['User', username, 'successfully', is_teacher ? 'marked' : 'unmarked', 'as teacher'].join (' '), 4000);
      location.reload ();
    }).fail (function (error) {
      console.log (error);
      modal.alert (['Error when', is_teacher ? 'marking' : 'unmarking', 'user', username, 'as teacher'].join (' '));
    });
  },

  changeUserEmail: function (username: string, email: string) {
    modal.prompt ('Please enter the corrected email', email, function (correctedEmail) {
      if (correctedEmail === email) return;
      if (! correctedEmail.match (auth.emailRegex)) return modal.alert ('Please enter a valid email.');
      $.ajax ({type: 'POST', url: '/admin/changeUserEmail', data: JSON.stringify ({username: username, email: correctedEmail}), contentType: 'application/json; charset=utf-8'}).done (function () {
        modal.alert (['Successfully changed the email for User', username, 'to', correctedEmail].join (' '));
        location.reload ();
      }).fail (function (error) {
        console.log (error);
        modal.alert (['Error when changing the email for User', username].join (' '));
      });
    });
  },

  getProgramStats: function (period: string, element: any) {
    if (element.classList.contains('active')) {
      return false
    }

    // Loader
    $('#stats-data').hide();
    $('#stats-spinner').show();

    // Set active
    $('.stats-period-toggle').removeClass('active');
    element.classList.add('active');

    let date = new Date();
    let end = date.toISOString().split('T')[0];
    if (period === 'week') {
      date.setDate(date.getDate() - 7);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    let start = date.toISOString().split('T')[0];

    const data = {
      start_date: start,
      end_date: end
    };

    $.get('/program-stats', data).done (function (response) {
      const runsChart = Chart.getChart('runsChart')!;
      runsChart.data.datasets[0].data = response;
      runsChart.data.datasets[1].data = response;
      runsChart.update();

      var exceptions = new Set<string>()
      for (var i=0; i<response.length; i++) {
        const t = Object.keys(response[i].data)
        for (var j=0; j<t.length; j++) {
          if (t[j].toLowerCase().endsWith('exception')) {
            exceptions.add(t[j])
          }
        }
      }

      const datasets = new Array();
      var color_index = 0;
      for (let ex of Array.from(exceptions)) {
        datasets.push({
          label: ex.substr(0, ex.length - 9),
          data: response,
          parsing: {
            xAxisKey: 'level',
            yAxisKey: 'data.' + ex,
          },
          backgroundColor: chart_colors[color_index % chart_colors.length],
          borderWidth: 0,
          pointRadius: 5,
          })
        color_index += 1;
      }

      const exceptionsChart = Chart.getChart('exceptionsChart')!;
      exceptionsChart.data.datasets = datasets;
      exceptionsChart.update();

    }).fail (function (error) {
      console.log(error);
    }).always(function() {
      $('#stats-spinner').hide();
      $('#stats-data').show();
    });

    return false;
  },
}

// *** LOADERS ***

if ($ ('#country')) {
  let html = $('#country').html();
  Object.keys (countries).map (function (code) {
    html += '<option value="' + code + '">' + countries [code] + '</option>';
  });
  $ ('#country').html (html);
}

$ ('.auth input').get ().map (function (el) {
  // Clear red borders if input was marked from a previous error.
  el.addEventListener ('input', () => auth.clear_error());
});

// We use GET /profile to see if we're logged in since we use HTTP only cookies and cannot check from javascript.
$.ajax ({type: 'GET', url: '/profile'}).done (function (response) {
  if (['/signup', '/login'].indexOf (window.location.pathname) !== -1) auth.redirect ('my-profile');

  auth.profile = response;
  if ($ ('#profile').html ()) {
    $ ('#username').html (response.username);
    $ ('#email').val (response.email);
    $ ('#birth_year').val (response.birth_year);
    $ ('#gender').val (response.gender);
    $ ('#country').val (response.country);
    if (response.prog_experience) {
      $ ('input[name=has_experience][value="' + response.prog_experience + '"]').prop ('checked', true);
      if (response.prog_experience === 'yes') $ ('#languages').show ();
    }
    (response.experience_languages || []).map (function (lang: string) {
       $ ('input[name=languages][value="' + lang + '"]').prop ('checked', true);
    });
    if (! jQuery.isEmptyObject(response.student_classes)) {
      $ ('#student_classes ul').html ((response.student_classes || []).map (function (Class: Class) {
        return '<li>' + auth.entityify (Class.name) + '</li>';
      }).join (''));
    } else {
      $ ('#student_classes').hide();
    }
  }
}).fail (function (_response) {
  if (window.location.pathname.indexOf ('/my-profile') !== -1) auth.redirect ('login');
});

if (window.location.pathname === '/reset') {
  const query = window.location.search.slice (1).split ('&');
  const params: Record<string, string> = {};
  query.map (function (item) {
    const split = item.split ('=');
    params [split [0]] = decodeURIComponent (split [1]);
  });
  // If we don't receive username and token, the redirect link is invalid. We redirect the user to /recover.
  if (! params['username'] || ! params['token']) auth.redirect ('recover')
  else auth.reset = params;
}

if (window.location.pathname === '/signup') {
  const login_username = localStorage.getItem ('hedy-login-username');
  if (login_username) {
    localStorage.removeItem ('hedy-login-username');
    if (login_username.match ('@')) $ ('#email').val (login_username);
    else                            $ ('#username').val (login_username);
  }
  const redirect = localStorage.getItem('hedy-save-redirect');
  if (redirect && redirect.includes('invite')) {
    $ ('#is_teacher_div').hide();
  }
}

$ ('#email, #mail_repeat').on ('cut copy paste', function (e) {
   e.preventDefault ();
   return false;
});

interface Class {
  name: string;
}

/**
 Charts setup
 */
$(function() {
  const runsCtx = document.getElementById('runsChart') as HTMLCanvasElement;
  new Chart(runsCtx, {
    type: 'bar',
    data: {
      datasets: [
      {
        label: 'Failed runs',
        data: {},
        parsing: {
          xAxisKey: 'level',
          yAxisKey: 'data.failed_runs',
        },
        backgroundColor: [chart_colors[0]],
        borderWidth: 0
      }, {
        label: 'Successful runs',
        data: {},
        parsing: {
          xAxisKey: 'level',
          yAxisKey: 'data.successful_runs',
        },
        backgroundColor: [chart_colors[1]],
        borderWidth: 0
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        },
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Level #'
          }
        }
      }
    }
  });

  const exCtx = document.getElementById('exceptionsChart') as HTMLCanvasElement;
  new Chart(exCtx, {
    type: 'line',
    data: {
      datasets: []
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          title: {
            display: true,
            text: 'Level #'
          }
        }
      }
    }
  });

  // Show the first stats by default when the page loads
  $('.stats-period-toggle').first().click()
});

/**
 * After login:
 *
 * - Check if there's a saved program in localstorage. If so, save it.
 * - Check if we were supposed to be joining a class. If so, join it.
 * - Otherwise redirect to "my programs".
 */
async function afterLogin() {
  const savedProgramString = localStorage.getItem('hedy-first-save');
  const savedProgram = savedProgramString ? JSON.parse(savedProgramString) : undefined;

  if (savedProgram) {
    await saveitP(savedProgram[0], savedProgram[1], savedProgram[2], savedProgram[3]);
    localStorage.removeItem('hedy-first-save');

    const redirect = getSavedRedirectPath();
    if (redirect) {
      return auth.redirect(redirect);
    }
  }

  const joinClassString = localStorage.getItem('hedy-join');
  const joinClass = joinClassString ? JSON.parse(joinClassString) : undefined;
  if (joinClass) {
    localStorage.removeItem('hedy-join');
    return join_class(joinClass.link, joinClass.name);
  }

  const redirect = getSavedRedirectPath();
  if (redirect) {
    return auth.redirect(redirect);
  }

  auth.redirect('programs');
}

function getSavedRedirectPath() {
  const redirect = localStorage.getItem('hedy-save-redirect');
  if (redirect) {
    localStorage.removeItem('hedy-save-redirect');
  }
  return redirect;
}

function validBirthYearString(year: string) {
  const birth_year = parseInt (year);
  if (! birth_year || birth_year < 1900 || birth_year > new Date ().getFullYear ()) return false;
  return true;
}

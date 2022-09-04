// import {Workbox} from 'workbox-window';
// import {backgroudPosters} from '/DEV/background.js';
import * as load from '/DEV/modules.js';

// if ('serviceWorker' in navigator) {
//     const wb = new Workbox('/sw.js');
//     wb.register();
// }

// Main DOM
const header = document.createElement('header');
const nav = document.createElement('nav');
const main = document.createElement('main');
// const test = document.createElement('div'); test.classList.add('test-div');

// Load page
document.body.onload = () => {
  document.body.append(main, header, nav);
  createHeader()
    .then( (elemets) => elemets.map(el => header.append(el)));
  createNav()
    .then( (buttons) => buttons.map(btn => nav.append(btn)))
    .then( () => {
      switch (true) {
        case (window.location.pathname == '/'):
          history.pushState( { type: 'movie' }, '', '/movie');
          document.getElementById('movie').classList.add('nav-active'); 
          document.querySelector('input').placeholder = 'Поиск фильмов';
          document.querySelector('input').setCustomValidity('Введите название фильма');
          movieMenuList();
          startPageContainer('movie'); header.style = null;
          break;
        case (window.location.pathname == '/movie'):
          document.getElementById('movie').classList.add('nav-active');
          document.querySelector('input').placeholder = 'Поиск фильмов';
          document.querySelector('input').setCustomValidity('Введите название фильма');
          movieMenuList();
          if (window.location.hash) {
            showMovie(window.location.hash.substring(1));
          } else {
            startPageContainer('movie'); header.style = null;
            history.pushState( { type: 'movie' }, '', '/movie');
          }
          break;
        case (window.location.pathname == '/tv'): 
          document.getElementById('tv').classList.add('nav-active');
          document.querySelector('input').placeholder = 'Поиск сериалов';
          document.querySelector('input').setCustomValidity('Введите название сериала');
          tvMenuList();
          if (window.location.hash) {
            showTv(window.location.hash.substring(1));
          } else {
            startPageContainer('tv'); header.style = null;
            history.pushState( { type: 'tv' }, '', '/tv');
          }
          break;
        case (window.location.pathname == '/person'): 
          document.getElementById('person').classList.add('nav-active');
          document.querySelector('input').placeholder = 'Поиск знаменитостей';
          document.querySelector('input').setCustomValidity('Введите имя знаменитости');
          personMenuList(); 
          if (window.location.hash) {
            showPerson(window.location.hash.substring(1));
          } else {
            startPageContainer('person'); header.style = null;
            history.pushState( { type: 'person' }, '', '/person');
          }
          break;
      }
  });
  startPage();
}

// Header ---------------------------------------------------------------------------------------
const createHeader = async () => {
  const logo = new Image(); logo.src = '/IMG/logo.svg'; logo.setAttribute('class', 'logo');
  const logoOverlay = load.div('logo-overlay');
  logoOverlay.onclick = () => {
    let active = document.getElementsByClassName('nav-active')[0].id;
    history.pushState( { type: active }, '', '/' + active);
    startPage().then(() => { startPageContainer(active); header.style = null; });
    searchFormInput.value = '';
    searchFormYear.value = '';
    searchFormYearLabel.style.display = 'none';
    searchFormYear.style.display = 'none';
    searchFormClrBtn.style.display = 'none';
    searchFormInput.classList.remove('text-inside');
  };

  const discoverOnMobile = document.createElement('div'); discoverOnMobile.classList.add('discover-on-mobile', 'material-symbols-rounded');
  document.fonts.load("24px Material Symbols Rounded").then( () => discoverOnMobile.textContent = 'manage_search');
  discoverOnMobile.onclick = () => {
    document.getElementById('menu').click();
  }

  const searchForm = document.createElement('form'); searchForm.id = 'search-form';

    const searchFormInput = document.createElement('input');
      searchFormInput.id = 'query'; 
      searchFormInput.type = 'search'; 
      searchFormInput.name = 'query';
      searchFormInput.autocomplete = 'off';
      searchFormInput.required = true;
      searchFormInput.onkeyup = () => {
        if (searchFormInput.value != '') {
          searchFormInput.setCustomValidity('');
          searchFormYearLabel.style.display = 'block';
          searchFormYear.style.display = 'block';
          searchFormClrBtn.style.display = 'flex';
          if (!searchFormInput.classList.contains('text-inside')) searchFormInput.classList.add('text-inside');
        } else {
          searchFormYearLabel.style.display = 'none';
          searchFormYear.style.display = 'none';
          searchFormClrBtn.style.display = 'none';
          searchFormInput.classList.remove('text-inside');
        }
      };
      searchFormInput.onfocus = () => {
        searchOverlay.style.display = 'block';
        setTimeout(() => {
          searchOverlay.style.opacity = "1";
        }, 1);
      }
      searchFormInput.onblur = () => {
        searchForm.style = null;
        setTimeout(() => {
          if (document.activeElement.id != 'query') {
            if (document.activeElement.id == 'year') return;
            searchOverlay.style.opacity = "0";
            setTimeout(() => {
              searchOverlay.style.display = 'none';
            }, 100);
          }
        }, 100);
      }
    const searchFormYear = document.createElement('input');
      searchFormYear.id = 'year'; 
      searchFormYear.type = 'number'; 
      searchFormYear.name = 'year';
      searchFormYear.autocomplete = 'off';
      searchFormYear.placeholder = 'любой';
      searchFormYear.style.display = 'none';
    const searchFormYearLabel = document.createElement('label');
      searchFormYearLabel.id = 'year-label';
      searchFormYearLabel.for = 'year';
      searchFormYearLabel.innerHTML = 'год';
      searchFormYearLabel.style.display = 'none';
      
      searchFormYear.onblur = () => {
        searchForm.style = null;
        setTimeout(() => {
          if (document.activeElement.id != 'query') {
            if (document.activeElement.id == 'year') return;
            searchOverlay.style.opacity = "0";
            setTimeout(() => {
              searchOverlay.style.display = 'none';
            }, 100);
          }
        }, 100);
      }

    const searchFormClrBtn = document.createElement('button');
      searchFormClrBtn.innerHTML = 'close';
      searchFormClrBtn.id = 'clear-btn';
      searchFormClrBtn.setAttribute('class', 'material-symbols-rounded');
      searchFormClrBtn.style.display = 'none'
      searchFormClrBtn.onclick = (event) => {
        event.preventDefault();
        searchFormInput.focus();
        searchFormInput.value = '';
        searchFormYear.value = '';
        searchFormYearLabel.style.display = 'none';
        searchFormYear.style.display = 'none';
        searchFormClrBtn.style.display = 'none';
        searchFormInput.classList.remove('text-inside');
      }

    const searchFormSbmBtn = document.createElement('button'); 
      searchFormSbmBtn.type = 'submit';
      searchFormSbmBtn.id = 'submit-btn';
      searchFormSbmBtn.innerHTML = 'search'; 
      searchFormSbmBtn.setAttribute('class', 'material-symbols-rounded');
    
    const searchOverlay = load.div('blur-3px' ,'search-overlay');
      searchOverlay.style.display = 'none';
      searchOverlay.style.opacity = '0';

    searchForm.append(searchFormInput, searchFormYearLabel, searchFormYear);
    document.fonts.load("24px Material Symbols Rounded")
      .then( () => searchForm.append(searchFormSbmBtn, searchFormClrBtn));

    searchForm.onsubmit = (event) => {
      const searchData = new FormData(searchForm);
      event.preventDefault();
      searchFormInput.blur();
      searchFormYear.blur();
      let active = document.getElementsByClassName('nav-active');
      searchMedia(searchData.get('query'), searchData.get('year'), active[0].id).catch( (error) => main.innerHTML = `${error}`);
      history.pushState( { type: active[0].id, search: searchData.get('query'), year: searchData.get('year') }, '', '/' + active[0].id + '?search=' + searchData.get('query')); 
    }

  return Promise.all([logo, logoOverlay, discoverOnMobile, searchOverlay, searchForm]);
}

// Header hide on scroll on mobile --------------------------------------------------------------
var prevScrollPosition = Math.round(main.scrollTop);
var headerTopPosition = 0;
function headerHide() {
  var currentScrollPosition = Math.round(main.scrollTop);
  var delta = prevScrollPosition - currentScrollPosition;
  if (prevScrollPosition > currentScrollPosition) {
    if (headerTopPosition <= 0) headerTopPosition += delta;
    if (headerTopPosition > 0) headerTopPosition = 0;
  }
  if (prevScrollPosition < currentScrollPosition) {
    if (headerTopPosition >= -85) headerTopPosition += delta;
    if (headerTopPosition < -85) headerTopPosition = -85;
  }
  header.style.top = headerTopPosition + 'px';
  prevScrollPosition = currentScrollPosition;
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  main.addEventListener('scroll', headerHide, false);
}

// Nav ------------------------------------------------------------------------------------------
const navButton = async (txt, symb, id) => {
  let btn = document.createElement('div');
  let title = document.createTextNode(txt);
  let iconCont = document.createElement('span');
  let icon = document.createElement('i');
  let symbol = document.createTextNode(symb);
  icon.setAttribute('class', 'material-symbols-rounded');
  document.fonts.load("24px Material Symbols Rounded").then(() => icon.appendChild(symbol));
  iconCont.appendChild(icon);
  btn.setAttribute('id', id);
  btn.append(iconCont, title);
  btn.onclick = () => {
    let active = document.getElementsByClassName('nav-active');
    if (active.length > 0) {
        for (let i = 0; i < active.length; i++) {
            active[i].classList.remove('nav-active');
        };
    }
    header.style = null;
    btn.classList.add('nav-active');
    history.pushState( { type: btn.id }, '', '/' + btn.id );
    switch (btn.id) {
      case 'movie': document.querySelector('input').placeholder = 'Поиск фильмов'; document.querySelector('input').setCustomValidity('Введите название фильма'); movieMenuList(); break;
      case 'tv': document.querySelector('input').placeholder = 'Поиск сериалов'; document.querySelector('input').setCustomValidity('Введите название сериала'); tvMenuList(); break;
      case 'person': document.querySelector('input').placeholder = 'Поиск знаменитостей'; document.querySelector('input').setCustomValidity('Введите имя знаменитости'); personMenuList(); break;
    }
    if (document.querySelector('input').value != '') { 
      const searchData = new FormData(document.getElementById('search-form'));  
      searchMedia(searchData.get('query'), searchData.get('year'), btn.id).catch( () => main.innerHTML = '¯\_(ツ)_/¯');
      history.pushState( { type: btn.id, search: searchData.get('query'), year: searchData.get('year') }, '', '/' + btn.id + '?search=' + searchData.get('query')); 
    } else if (main.classList.contains('start')) {
      startPageContainer(btn.id);
    } else {
      startPage().then(() => startPageContainer(btn.id));
    }
  };
  return btn;
}

const navMenu = async () => {
  let container = load.div('nav-menu', 'menu');
  let subCont = load.div();
  let icon = await load.text('menu', 'material-symbols-rounded');
  document.fonts.load("24px Material Symbols Rounded").then( () => subCont.append(icon)).then( () => container.append(subCont));

  container.onclick = () => {
    if (container.children[0].children[0].textContent == 'menu') {
      container.children[0].children[0].textContent = 'menu_open';
      nav.classList.add('menu-open');
      document.getElementById('nav-menu-list').style.display = 'flex';
    } else {
      container.children[0].children[0].textContent = 'menu';
      nav.classList.remove('menu-open');
      setTimeout(() => {
        document.getElementById('nav-menu-list').style.display = 'none';
      }, "200")
    };
  }

  return container;
}

const createNav = async () => {
  let menu = navMenu();
  let movies = navButton('Фильмы', 'Movie', 'movie');
  let tvs = navButton('Сериалы', 'Videocam', 'tv');
  let people = navButton('Люди', 'Person', 'person');
  let listContainer = load.div('no-select', 'nav-menu-list'); listContainer.style.display = 'none';

  return Promise.all([menu, movies, tvs, people, listContainer]);
}

// Search Tile ----------------------------------------------------------------------------------
const tileContent = async (media, type) => {
  let media_poster, media_title, media_original_title, media_release_date;
  switch (type) {
    case 'movie': media_poster = media.poster_path; media_title = media.title; media_original_title = media.original_title; media_release_date = media.release_date; break;
    case 'tv': media_poster = media.poster_path; media_title = media.name; media_original_title = media.original_name; media_release_date = media.first_air_date; break;
    case 'person': media_poster = media.profile_path; media_title = media.name; media.vote_average = 100; break;
  }
  
  let poster = load.image(media_poster, 'poster');

  let titles = document.createElement('div'); titles.setAttribute('class', 'titles');
  let title = load.text(media_title, 'title'); 
  let originalTitle = load.text(media_original_title, 'original-title');
  (await Promise.all([title, originalTitle])).map((el) => { if (el) titles.append(el)});

  let releaseDate = load.date(media_release_date, 'release-date');
  let voteAverage = load.votesCircle(media.vote_average, 21, 25, 'votes', media.vote_count);
  let tileOverlay = document.createElement('div'); tileOverlay.setAttribute('class','tile-overlay');

  tileOverlay.onclick = () => {
    load.clearSearch();
    switch (type) {
      case 'movie': 
        showMovie(media.id).catch( (error) => main.innerHTML = `${error}`);
        history.pushState( { type: 'movie', id: media.id}, '', '/movie#' + media.id ); 
        break;
      case 'tv': 
        showTv(media.id).catch( (error) => main.innerHTML = `${error}`);
        history.pushState( { type: 'tv', id: media.id}, '', '/tv#' + media.id );
        break;
      case 'person': 
        showPerson(media.id).catch( (error) => main.innerHTML = `${error}`);
        history.pushState( { type: 'person', id: media.id}, '', '/person#' + media.id );
        break;
  }}

  return Promise.all([poster, titles, releaseDate, voteAverage, tileOverlay]);
}

var args = []; // Arguments for scroll event function

// Search ---------------------------------------------------------------------------------------
const searchMedia = async (query, year, type, page) => {
  
  if (main.classList.contains('start')) {
    main.classList.remove('start');
    main.innerHTML = '';
  }

  if (!page) {
    load.fetchAnimation(); main.style.overflow = 'hidden';
    var req = `t=${type}&q=${query}&y=${year}`;
  } else {
    var req = `t=${type}&q=${query}&y=${year}&p=${page}`;
  }

  let response = await fetch(`https://kz.srrlab.ru/search/?${req}`);
  const data = await response.json();

  if (!page) { main.innerHTML = ''; main.style = null; } else if (document.getElementById('load-more')) { main.removeChild(document.getElementById('load-more')); }
  main.setAttribute('class', 'search');
  load.tileLoadingAnimation(data.results.length);

  if (data.page == 'error') { main.innerHTML = `Ошибка PHP cURL запроса: ${data.error}`; return; }
  if (data.results.length == 0) { load.nothingFound().then((cont) => { main.innerHTML = ''; main.append(cont); return; } )}

  let tiles = await Promise.all(data.results.map( async (movie) => {
    let tile = document.createElement('div'); 
    if (type == 'person') {
      tile.setAttribute('class','tile person-tile no-select');
    } else {
      tile.setAttribute('class','tile no-select');
    }

    let cont = await tileContent(movie, type);
    if (!cont[0]) return;
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  if (!page) {
    main.scrollTop = 0;
    main.innerHTML = ''; main.removeEventListener('scroll', onScroll, false); args.length = 0;
    tiles.map((tile) => { if (tile) { main.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 50) }});
  } else {
    Array.from(document.getElementsByClassName('loading')).forEach( (element) => { main.removeChild(element) });    
    tiles.map((tile) => { if (tile) { main.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 50) }});
  }

  if (data.total_pages > 1) {
    if (!page || page < data.total_pages) {
      if (!page) { searchMedia(query, year, type, 2); return; }
      let nextpage = page + 1;
      args.push(query, year, type, nextpage);
      main.addEventListener('scroll', onScroll, false);
    }
  }
}

// Discover ------------------------------------------------------------------------------------
// Movie lists
const movieMenuList = async () => {
  let cont = document.getElementById('nav-menu-list');
  cont.innerHTML = '';
  let topRated = await load.text('Топ фильмов', '', 'top_rated'); cont.append(topRated);
  let popular = await load.text('Популярные', '', 'popular'); cont.append(popular);
  let upcoming = await load.text('Новинки', '', 'upcoming'); cont.append(upcoming);

  let filters = await load.filters('movie'); cont.append(filters);

  cont.childNodes.forEach(element => {
    if (element == filters) return;
    element.onclick = () => {
      discover('list', 'movie', element.id);
      history.pushState( { type: 'movie', list: element.id}, '', '/movie?list=' + element.id );
      document.getElementById('menu').click();
    }
  });
}

// Tv lists
const tvMenuList = async () => {
  let cont = document.getElementById('nav-menu-list');
  cont.innerHTML = '';
  let topRated = await load.text('Топ сериалов', '', 'top_rated'); cont.append(topRated);
  let popular = await load.text('Популярные', '', 'popular'); cont.append(popular);
  let upcoming = await load.text('В этом сезоне', '', 'on_the_air'); cont.append(upcoming);

  let filters = await load.filters('tv'); cont.append(filters);
  
  cont.childNodes.forEach(element => {
    if (element == filters) return;
    element.onclick = () => {
      discover('list', 'tv', element.id);
      history.pushState( { type: 'tv', list: element.id}, '', '/tv?list=' + element.id );
      document.getElementById('menu').click();
    }
  });

}

// Person lists
const personMenuList = async () => {
  let cont = document.getElementById('nav-menu-list');
  cont.innerHTML = '';
}

// Discover
export const discover = async (a, type, list, page) => {

  if (main.classList.contains('start')) {
    main.classList.remove('start');
    main.innerHTML = '';
  }

  let sort = document.getElementById('filters-sort');
  let order = document.getElementById('filters-order');
  let minRating = document.getElementById('min-rating');
  let maxRating = document.getElementById('max-rating');
  let minVotes = document.getElementById('min-votes');
  let maxVotes = document.getElementById('max-votes');
  let minDate = document.getElementById('min-year');
  let maxDate = document.getElementById('max-year');
  
  if (sort) {
    var sortBy = `&sort_by=${sort.value}.${order.value}`;
    var discover_vars = sortBy;
    if (minRating.value) discover_vars = discover_vars.concat(`&vote_average_gte=${minRating.value}`);
    if (maxRating.value) discover_vars = discover_vars.concat(`&vote_average_lte=${maxRating.value}`);
    if (minVotes.value) discover_vars = discover_vars.concat(`&vote_count_gte=${minVotes.value}`);
    if (maxVotes.value) discover_vars = discover_vars.concat(`&vote_count_lte=${maxVotes.value}`);
    if (minDate.value) discover_vars = discover_vars.concat(`&primary_release_date_gte=${minDate.value}`);
    if (maxDate.value) discover_vars = discover_vars.concat(`&primary_release_date_lte=${maxDate.value}`);
  }

  if (!page) {
    load.fetchAnimation(); main.style.overflow = 'hidden';
    if (a == 'list') var req = `t=${type}&l=${list}`;
    if (a == 'discover') var req = `t=${type}${discover_vars}`;
  } else {
    if (a == 'list') var req = `t=${type}&l=${list}&p=${page}`;
    if (a == 'discover') var req = `t=${type}${discover_vars}&page=${page}`;
  }
  
  let response = await fetch(`https://kz.srrlab.ru/${a}/?${req}`);
  const data = await response.json();

  if (!page) { main.innerHTML = ''; main.style = null; } else if (document.getElementById('load-more')) { main.removeChild(document.getElementById('load-more')); }
  main.setAttribute('class', 'discover');
  load.tileLoadingAnimation(data.results.length);

  if (data.page == 'error') { main.innerHTML = `Ошибка PHP cURL запроса: ${data.error}`; return; }
  if (data.results.length == 0) { load.nothingFound().then((cont) => { main.innerHTML = ''; main.append(cont); return; } )}

  let tiles = await Promise.all(data.results.map( async (movie) => {
    let tile = document.createElement('div'); 
    if (type == 'person') {
      tile.setAttribute('class','tile person-tile no-select');
    } else {
      tile.setAttribute('class','tile no-select');
    }

    let cont = await tileContent(movie, type);
    if (!cont[0]) return;
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  if (!page) {
    main.scrollTop = 0;
    main.innerHTML = ''; main.removeEventListener('scroll', onScroll, false); args.length = 0;
    tiles.map((tile) => { if (tile) { main.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 50) }});
  } else {
    Array.from(document.getElementsByClassName('loading')).forEach( (element) => { main.removeChild(element) });
    tiles.map((tile) => { if (tile) { main.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 50) }});
  }

  if (data.total_pages > 1) {
    if (!page || page < data.total_pages) {
      if (!page) { discover(a, type, list, 2); return; }
      let nextpage = page + 1;
      args.push(a, type, list, nextpage);
      main.addEventListener('scroll', onScroll, false);
    }
  }
}

// Load on scroll -------------------------------------------------------------------------------
function onScroll() {
  let discoverPage = main.classList.contains('discover');
  let searchPage = main.classList.contains('search');
  if (!(discoverPage || searchPage)) return;
  if (main.offsetHeight + main.scrollTop + 680 >= main.scrollHeight) {
    main.removeEventListener('scroll', onScroll, false);
    var loadMore = document.createElement('div'); loadMore.id = 'load-more'; main.append(loadMore);
    let cpi = new Image(48, 48); cpi.src = 'IMG/cpi.svg'; loadMore.append(cpi);
    if (discoverPage) {
      discover.apply(null, args);
      args.length = 0;
    }
    if (searchPage) {
      searchMedia.apply(null, args);
      args.length = 0;
    }
  }
}

// Movie ----------------------------------------------------------------------------------------
export const showMovie = async (id) => {
  if (main.classList.contains('start')) {
    main.classList.remove('start');
    main.innerHTML = '';
  }
  load.fetchAnimation(); main.style.overflow = 'hidden';

  const response = await fetch(`https://kz.srrlab.ru/movie/?id=${id}`);

  const movie = await response.json();
  if (movie.id == 'error') { main.innerHTML = `Ошибка PHP cURL запроса: ${movie.error}`; return; }

  let style = load.vibrantStyles(movie.poster_path);

  let poster = load.image(movie.poster_path, 'movie-poster');
  let backdrop = load.image(movie.backdrop_path, 'backdrop');
  let backdropOverlay = document.createElement('div'); backdropOverlay.setAttribute('class', 'movie-backdrop-overlay');

  let titles = document.createElement('div'); titles.setAttribute('class', 'movie-titles');
  let russianTitle = load.text(movie.title, 'movie-title');
  let originalTitle = load.text(movie.original_title, 'movie-original-title');
  (await Promise.all([russianTitle, originalTitle])).map((el) => { if (el) titles.append(el)});

  let genresArr = Promise.all(movie.genres.map( (genre) => load.text(genre.name, 'movie-genre')));
  let genres = document.createElement('div'); genres.setAttribute('class', 'movie-genres');
  (await genresArr).map((el) => genres.append(el));

  let tagline = load.text(movie.tagline, 'movie-tagline');
  let overview = load.text(movie.overview, 'movie-overview');
  let status = load.text(load.mediaStatus(movie.status), 'movie-status');
  if (movie.budget) { var budget = load.text(load.formatUSD.format(movie.budget), 'movie-budget'); }
  if (movie.revenue) { var revenue = load.text(load.formatUSD.format(movie.revenue), 'movie-revenue'); }

  let releaseDate = load.date(movie.release_date, 'movie-release-date');
  let voteTile = load.text('Пользовательский рейтинг', 'movie-votes-title');
  let voteAverage = load.votesCircle(movie.vote_average, 44, 50, 'movie-votes', movie.vote_count);
  let voteCount = load.text(movie.vote_count, 'movie-vote-count');

  let videos = load.mediaVideos(movie.videos);
  
  let directors = [];
  let screenplays = [];
  movie.credits.crew.forEach(el => {
    if (el.job == "Director") directors.push(el.name);
    if (el.job == "Screenplay") screenplays.push(el.name);
  });

  let crew = document.createElement('div'); crew.setAttribute('class', 'crew');
  let director = directors.map(el => load.text(el, 'director'));
  (await Promise.all(director)).map((el) => { if (el) crew.append(el)});
  let screenplay = screenplays.map(el => load.text(el, 'screenplay'));
  (await Promise.all(screenplay)).map((el) => { if (el) crew.append(el)});

  let actors = document.createElement('div'); actors.setAttribute('class', 'movie-actors');
  let actorsContainer = document.createElement('div');
  actorsContainer.setAttribute('class', 'movie-actors-container');
  actorsContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    actorsContainer.scrollLeft += evt.deltaY;
  });
  actors.append(actorsContainer);

  var actorQtt = 0;
  for (let i = 0; i < movie.credits.cast.length; i++) {
    if (movie.credits.cast[i].profile_path) {
      actorQtt ++;
      load.actor(movie.credits.cast[i].profile_path, movie.credits.cast[i].name, movie.credits.cast[i].character, movie.credits.cast[i].id)
        .then( tile => { if (tile) actorsContainer.append(tile)});
    }
    if (i == 20) break;
  }
  actorsContainer.style.gridTemplateColumns = 'repeat(' + actorQtt + ', 100px)';
  let content = await Promise.all([style, poster, backdrop, backdropOverlay, titles, genres, tagline, overview, status, budget, revenue,
                      releaseDate, voteTile, voteAverage, voteCount, crew, actors, videos]);

  main.innerHTML = '';
  main.style = null;
  main.scrollTop = 0;
  main.setAttribute('class','movie');
  content.map((el) => { if (el) main.append(el) });

  if (movie.belongs_to_collection) {
    var collectionTile = document.createElement('div'); collectionTile.classList.add('movie-collection'); 

    let backdrop = load.image(movie.belongs_to_collection.backdrop_path, 'movie-collection-backdrop');
    let title = load.text(movie.belongs_to_collection.name, 'movie-collection-name');
    (await Promise.all([backdrop, title])).map((el) => { if (el) collectionTile.append(el) } );
    main.append(collectionTile); setTimeout(() => { collectionTile.style.opacity = '1';}, 10);
  }
 
  if (movie.recommendations.results.length != 0) {
    var suggested = document.createElement('div'); suggested.setAttribute('class', 'movie-suggested'); 
    main.append(suggested); setTimeout(() => { suggested.style.opacity = '1';}, 10);
    var suggestedContainer = document.createElement('div'); suggestedContainer.setAttribute('class', 'movie-suggested-container'); 
    suggestedContainer.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      suggestedContainer.scrollLeft += evt.deltaY;
    });
  }
    
  if (movie.belongs_to_collection) {
    const response = await fetch(`https://kz.srrlab.ru/collection/?id=${movie.belongs_to_collection.id}`);
    const collection = await response.json();

    let sortByDate = (content) => {
      content.sort( (a, b) => {             
        let fist = a.release_date; if (fist == '') fist = '2100-01-01';
        let second = b.release_date; if (second == '') second = '2100-01-01';
        if (fist < second) { return -1; }
        if (fist > second) { return 1; }
        return 0;
      });
    }
    sortByDate(collection.parts);
  
    let parts = document.createElement('div'); parts.id = 'parts-container'; parts.classList.add('no-select');
    parts.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      parts.scrollLeft += evt.deltaY;
    });
    parts.style.gridTemplateColumns = 'repeat(' + collection.parts.length + ', 157px)';
    collectionTile.append(parts);
  
    let partTiles = await Promise.all(collection.parts.map( async (part) => {
      let partTile = document.createElement('div'); partTile.classList.add('tile', 'no-select');
      let poster; if (part.poster_path) {
        poster = load.image(part.poster_path, 'poster');
      } else {
        poster = load.image(collection.poster_path, 'poster no-poster');
      }
        let titles = document.createElement('div'); titles.classList.add('titles');
          let title = load.text(part.title, 'title'); 
          let originalTitle = load.text(part.original_title, 'original-title');
          (await Promise.all([title, originalTitle])).map((el) => { if (el) titles.append(el)});
        let releaseDate = load.date(part.release_date, 'release-date');
        let voteAverage = load.votesCircle(part.vote_average, 21, 25, 'votes', part.vote_count);
        let tileOverlay = document.createElement('div'); tileOverlay.classList.add('tile-overlay');
        tileOverlay.onclick = () => {
          showMovie(part.id).catch( (error) => main.innerHTML = `${error}`);
          history.pushState( { type: 'movie', id: part.id}, '', '/movie#' + part.id );
        }
        (await Promise.all([poster, titles, releaseDate, voteAverage, tileOverlay])).map((el) => { if (el) partTile.append(el) } );
  
      return partTile;
    }));
  
    partTiles.map((tile) => { if (tile) { parts.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 10) }});
  }

  if (movie.recommendations.results.length != 0) {
    var qtt = 0;
    let tiles = await Promise.all(movie.recommendations.results.map( async (movie) => {
      if (!movie.poster_path) return;
      qtt ++;
      let tile = document.createElement('div'); tile.setAttribute('class','tile no-select');
        let poster = load.image(movie.poster_path, 'poster');
        let titles = document.createElement('div'); titles.setAttribute('class', 'titles');
          let title = load.text(movie.title, 'title'); 
          let originalTitle = load.text(movie.original_title, 'original-title');
          (await Promise.all([title, originalTitle])).map((el) => { if (el) titles.append(el)});
        let voteAverage = load.votesCircle(movie.vote_average, 21, 25, 'votes', movie.vote_count);
        let tileOverlay = document.createElement('div'); tileOverlay.setAttribute('class','tile-overlay');
          tileOverlay.onclick = () => {
            showMovie(movie.id).catch( (error) => main.innerHTML = `${error}`);
            history.pushState( { type: 'movie', id: movie.id}, '', '/movie#' + movie.id );
          }
      (await Promise.all([poster, titles, voteAverage, tileOverlay])).map((el) => { if (el) tile.append(el) } );
      return tile;
    }));
    suggestedContainer.style.gridTemplateColumns = 'repeat(' + qtt + ', 157px)';
    tiles.map((tile) => { if (tile) { suggestedContainer.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 10) }});
    suggested.append(suggestedContainer);
  }
}

// TV -------------------------------------------------------------------------------------------
export const showTv = async (id) => {
  if (main.classList.contains('start')) {
    main.classList.remove('start');
    main.innerHTML = '';
  }
  load.fetchAnimation(); main.style.overflow = 'hidden';

  const response = await fetch(`https://kz.srrlab.ru/tv/?id=${id}`);
  const tv = await response.json();
  if (tv.id == 'error') { main.innerHTML = `Ошибка PHP cURL запроса: ${tv.error}`; return; }

  let style = load.vibrantStyles(tv.poster_path);

  let poster = load.image(tv.poster_path, 'tv-poster');
  let backdrop = load.image(tv.backdrop_path, 'backdrop');
  let backdropOverlay = document.createElement('div'); backdropOverlay.setAttribute('class', 'tv-backdrop-overlay');

  let titles = document.createElement('div'); titles.setAttribute('class', 'tv-titles');
  let russianTitle = load.text(tv.name, 'tv-title');
  let originalTitle = load.text(tv.original_name, 'tv-original-title');
  (await Promise.all([russianTitle, originalTitle])).map((el) => { if (el) titles.append(el)});

  let genresArr = Promise.all(tv.genres.map( (genre) => load.text(genre.name, 'tv-genre')));
  let genres = document.createElement('div'); genres.setAttribute('class', 'tv-genres');
  (await genresArr).map((el) => genres.append(el));

  let tagline = load.text(tv.tagline, 'tv-tagline');
  let overview = load.text(tv.overview, 'tv-overview');
  let status = load.text(load.mediaStatus(tv.status), 'tv-status');

  if (tv.first_air_date) { var firstAir = load.date(tv.first_air_date, 'tv-first-air-date'); }
  if (tv.last_air_date) { var lastAir = load.date(tv.last_air_date, 'tv-last-air-date'); }

  let voteTile = load.text('Пользовательский рейтинг', 'tv-votes-title');
  let voteAverage = load.votesCircle(tv.vote_average, 44, 50, 'tv-votes', tv.vote_count);
  let voteCount = load.text(tv.vote_count, 'tv-vote-count');
  let studio = load.image(tv.networks[0].logo_path, 'tv-studio');

  // TV seasons
  let seasons = document.createElement('div'); seasons.setAttribute('class', 'tv-seasons');
  let specials; if (tv.seasons[0].name.includes('Спецматериалы')) specials = tv.seasons.shift(); // special episodes are useless I think, so I'm not gonna use it
  let seasonsTiles = await Promise.all(tv.seasons.map( (season) => load.seasonTile(tv.id, season, tv.poster_path)));
  seasonsTiles.map( (el) => seasons.append(el) );

  // Produsers
  let producers = [];
  let execProducers = [];
  tv.credits.crew.forEach(el => {
    if (el.job == "Producer") producers.push(el.name);
    if (el.job == "Executive Producer") execProducers.push(el.name);
  });

  let crew = document.createElement('div'); crew.setAttribute('class', 'tv-crew');
  if (execProducers.length != 0) {
    let execProducerContainer = load.div('exec-producer'); let execProducerContainerSub = load.div();

    let execProducer = execProducers.map(el => load.text(el));
    (await Promise.all(execProducer)).map((el) => { if (el) execProducerContainerSub.append(el)});
    execProducerContainer.append(execProducerContainerSub);
    crew.append(execProducerContainer); 
  }
   
  let content = await Promise.all([style, poster, backdrop, backdropOverlay, titles, genres, tagline, overview, status, firstAir, lastAir,
                      voteTile, voteAverage, voteCount, studio, crew, seasons]);

  main.innerHTML = '';
  main.style = null;
  main.scrollTop = 0;
  main.setAttribute('class','tv');
  content.map((el) => { if (el) main.append(el) });
  
  if (tv.recommendations.results.length != 0) {
    let suggested = document.createElement('div'); suggested.setAttribute('class', 'tv-suggested');
    main.append(suggested); setTimeout(() => { suggested.style.opacity = '1';}, 10);
    var suggestedContainer = document.createElement('div'); suggestedContainer.setAttribute('class', 'tv-suggested-container'); 
    suggestedContainer.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      suggestedContainer.scrollLeft += evt.deltaY;
    });
    var qtt = 0;
    let tiles = await Promise.all(tv.recommendations.results.map( async (tv) => {
      if (!tv.poster_path) return;
      qtt ++;
      let tile = document.createElement('div'); tile.setAttribute('class','tile no-select');
        let poster = load.image(tv.poster_path, 'poster');
        let titles = document.createElement('div'); titles.setAttribute('class', 'titles');
          let title = load.text(tv.name, 'title'); 
          let originalTitle = load.text(tv.original_name, 'original-title');
          (await Promise.all([title, originalTitle])).map((el) => { if (el) titles.append(el)});
        let voteAverage = load.votesCircle(tv.vote_average, 21, 25, 'votes', tv.vote_count);
        let tileOverlay = document.createElement('div'); 
          tileOverlay.setAttribute('class', 'tile-overlay');
          tileOverlay.onclick = () => {
            showTv(tv.id).catch( (error) => main.innerHTML = `${error}`); 
            history.pushState( { type: 'tv', id: tv.id}, '', '/tv#' + tv.id );
          }
      (await Promise.all([poster, titles, voteAverage, tileOverlay])).map((el) => { if (el) tile.append(el) } );
      return tile;
    }));
    suggestedContainer.style.gridTemplateColumns = 'repeat(' + qtt + ', 157px)';
    tiles.map((tile) => { if (tile) { suggestedContainer.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 10) }});
    suggested.append(suggestedContainer);
  }
}

// Person ---------------------------------------------------------------------------------------
export const showPerson = async (id) => {
  if (main.classList.contains('start')) {
    main.classList.remove('start');
    main.innerHTML = '';
  }
  load.fetchAnimation(); main.style.overflow = 'hidden';

  const response = await fetch(`https://kz.srrlab.ru/person/?id=${id}`);
  const person = await response.json();
  if (person.id == 'error') { main.innerHTML = `Ошибка PHP cURL запроса: ${person.error}`; return; }

  let poster = load.image(person.profile_path, 'person-poster');
  
  let russianName;
  const cyrillicPattern = /^[\u0410-\u044F\s]+$/;
  person.also_known_as.forEach(element => {
    if (cyrillicPattern.test(element)) russianName = element;
  });

  if (russianName) {
    var name = load.text(russianName, 'person-name');
  } else {
    var name = load.text(person.name, 'person-name');
  }

  if (person.deathday) {
    var dates = load.personDates(person.birthday, person.deathday);
  } else {
    var dates = load.personDates(person.birthday);
  }
  let biography = load.text(person.biography, 'person-biography');

  let MovieTiles = await Promise.all(person.movie_credits.cast.map( async (movie) => {
    let tile = document.createElement('div'); 
    tile.setAttribute('class','tile no-select');

    let cont = await tileContent(movie, 'movie');
    if (cont[3].classList.contains('low-votes')) return; // remove movies with low votes 
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  let TvTiles = await Promise.all(person.tv_credits.cast.map( async (movie) => {
    let tile = document.createElement('div'); 
    tile.setAttribute('class','tile no-select');

    let cont = await tileContent(movie, 'tv');
    if (cont[3].classList.contains('low-votes')) return; // remove tvs with low votes 
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  let movies = load.div('person-movies');
  MovieTiles.map((tile) => { if (tile) { movies.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 10) }});
  let tvs = load.div('person-tvs');
  TvTiles.map((tile) => { if (tile) { tvs.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 10) }});

  let content = await Promise.all([poster, name, dates, biography, movies, tvs]);

  main.innerHTML = '';
  main.style = null;
  main.scrollTop = 0;
  main.setAttribute('class','person');
  content.map((el) => { if (el) main.append(el) });
}

// Start page -----------------------------------------------------------------------------------
const startPageContainer = async (type) => {

  switch (type) {
    case 'movie': var popularTitle = 'Популярные фильмы'; var topTitle = 'Топ фильмов'; break;
    case 'tv': var popularTitle = 'Популярные сериалы'; var topTitle = 'Топ сериалов'; break;
    case 'person': var popularTitle = 'Популярные люди'; break;
  }

  document.getElementById('start-container').innerHTML = '';
  let leftBorder = document.createElement('div'); leftBorder.classList.add('start-left-border');
  let rightBorder = document.createElement('div'); rightBorder.classList.add('start-right-border');
  let popularContainerTitle = load.div(`start-popular-title`); popularContainerTitle.innerHTML = popularTitle;
  popularContainerTitle.onclick = () => {
    discover('list', type, 'popular');
    history.pushState( { type: type, list: 'popular'}, '', '/' + type + '?list=popular');
  }
  var popularContainer = document.createElement('div');
  if (type == 'person') {
    popularContainer.setAttribute('class','start-popular person-tile');
  } else {
    popularContainer.setAttribute('class','start-popular');
  }
  document.getElementById('start-container').append(leftBorder, rightBorder, popularContainerTitle, popularContainer);

  for (let i = 0; i < 19; i++) {
    let ani = document.createElement('div'); ani.setAttribute('class', 'tile no-select loading');
    ani.innerHTML = '<div class="poster"></div><div class="titles"></div><div class="release-date"></div><div class="votes"></div>';
    popularContainer.append(ani);
  }

  if (type != 'person') { // Person category contains one list only -------------------------------
  
    let topContainerTitle = load.div(`start-top-title`); topContainerTitle.innerHTML = topTitle;
    topContainerTitle.onclick = () => {
      discover('list', type, 'top_rated');
      history.pushState( { type: type, list: 'top_rated'}, '', '/' + type + '?list=top_rated');
    }
    var topContainer = load.div(`start-top`);
    document.getElementById('start-container').append(topContainerTitle, topContainer);
  
    for (let i = 0; i < 19; i++) {
      let ani = document.createElement('div'); ani.setAttribute('class', 'tile no-select loading');
      ani.innerHTML = '<div class="poster"></div><div class="titles"></div><div class="release-date"></div><div class="votes"></div>';
      topContainer.append(ani);
    }
  }

  let responsePopular = await fetch(`https://kz.srrlab.ru/list/?t=${type}&l=popular`);
  const popular = await responsePopular.json();

  let tilesPopular = await Promise.all(popular.results.map( async (movie) => {
    let tile = document.createElement('div');
    if (type == 'person') {
      tile.setAttribute('class','tile person-tile no-select');
    } else {
      tile.setAttribute('class','tile no-select');
    }

    let cont = await tileContent(movie, type);
    if (!cont[0]) return;
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  if (type != 'person') { // Person category contains one list only -------------------------------
  
  let responseTop = await fetch(`https://kz.srrlab.ru/list/?t=${type}&l=top_rated`);
  const top = await responseTop.json();

  let tilesTop = await Promise.all(top.results.map( async (movie) => {
    let tile = document.createElement('div'); 
    tile.setAttribute('class','tile no-select');

    let cont = await tileContent(movie, type);
    if (!cont[0]) return;
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  topContainer.innerHTML = '';
  topContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    topContainer.scrollLeft += evt.deltaY;
  });
  tilesTop.map( el => {if (el) {
    topContainer.append(el);
    setTimeout(() => {
      el.style.opacity = '1';
    }, 50)
  }});
  }
  
  popularContainer.innerHTML = '';
  popularContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    popularContainer.scrollLeft += evt.deltaY;
  });
  tilesPopular.map( el => { if (el) {
    popularContainer.append(el);
    setTimeout(() => {
      el.style.opacity = '1';
    }, 50)
  }});

}

const startPage = async () => {
  main.innerHTML = ''; main.setAttribute('class', 'start'); main.removeEventListener('scroll', onScroll, false);
  let titleOverlay = load.div('start-title-overlay');
  let titleContainer = load.div('start-title-container no-select');

    let header = load.text('Добро пожаловать');
    let subHeader = load.text('на русскоязычный неоффициальный сайт');
    let tmdbLogo = new Image(); tmdbLogo.src = '/IMG/official_tmdb_logo.svg';
    (await Promise.all([header, subHeader, tmdbLogo])).map(el => titleContainer.append(el));
  
  let startContainer = document.createElement('div'); startContainer.id = 'start-container';

  [titleContainer, titleOverlay, startContainer].map(el => main.append(el));
}

// Browser history
window.onpopstate = () => {
  switch (history.state.type) {
    case 'movie':
      if (history.state.id) {
        showMovie(history.state.id);
      } else if (history.state.search) {
        searchMedia(history.state.search, history.state.year, history.state.type);
      } else if (history.state.list) {
        discover('list', 'movie', history.state.list);
      } else if (window.location.search === '?discover') {
        load.setFilters(history.state.sort, history.state.order, history.state.minRating, history.state.maxRating, history.state.minVotes, history.state.maxVotes, history.state.minDate, history.state.maxDate);
        discover('discover', 'movie');
      } else {
        startPage().then(() => { startPageContainer(history.state.type); header.style = null; });
      } break;
    case 'tv':
      if (history.state.id) {
        showTv(history.state.id);
      } else if (history.state.search) {
        searchMedia(history.state.search, history.state.year, history.state.type);
      } else if (history.state.list) {
        discover('list', 'tv', history.state.list);
      } else if (window.location.search === '?discover') {
        load.setFilters(history.state.sort, history.state.order, history.state.minRating, history.state.maxRating, history.state.minVotes, history.state.maxVotes, history.state.minDate, history.state.maxDate);
        discover('discover', 'tv');
      } else {
        startPage().then(() => { startPageContainer(history.state.type); header.style = null; });
      } break;
    case 'person':
      if (history.state.id) {
        showPerson(history.state.id);
      } else if (history.state.search) {
        searchMedia(history.state.search, history.state.year, history.state.type);
      } else {
        startPage().then(() => { startPageContainer(history.state.type); header.style = null; });
      } break;
  }
}
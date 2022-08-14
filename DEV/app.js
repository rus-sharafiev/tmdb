// import {Workbox} from 'workbox-window';
import * as load from '/DEV/modules.js';

// if ('serviceWorker' in navigator) {
//     const wb = new Workbox('/sw.js');
//     wb.register();
// }

// Main DOM
const header = document.createElement('header');
const nav = document.createElement('nav');
const main = document.createElement('main');
const footer = document.createElement('footer');

// Load page
document.body.onload = () => {
  document.body.append(header, nav, main, footer); 
  createHeader()
    .then( (elemets) => elemets.map(el => header.append(el)));
  createNav()
    .then( (buttons) => buttons.map(btn => nav.append(btn)))
    .then( () => {
      switch (true) {
        case (window.location.pathname == '/') : 
          document.getElementById('movie').classList.add('nav-active'); 
          document.querySelector('input').placeholder = 'Поиск фильмов';
          document.querySelector('input').setCustomValidity('Введите название фильма');
          movieMenuList(); break;
        case (window.location.pathname == '/movie') : 
          document.getElementById('movie').classList.add('nav-active');
          document.querySelector('input').placeholder = 'Поиск фильмов';
          document.querySelector('input').setCustomValidity('Введите название фильма');
          movieMenuList(); break;
        case (window.location.pathname == '/tv') : 
          document.getElementById('tv').classList.add('nav-active');
          document.querySelector('input').placeholder = 'Поиск сериалов';
          document.querySelector('input').setCustomValidity('Введите название сериала');
          tvMenuList(); break;
        case (window.location.pathname == '/person') : 
          document.getElementById('person').classList.add('nav-active');
          document.querySelector('input').placeholder = 'Поиск знаменитостей';
          document.querySelector('input').setCustomValidity('Введите имя знаменитости');
          personMenuList(); break;
      }
  });
  startPage();
  // searchMedia('друзья', 'movie').catch( (error) => main.innerHTML = `${error}`);
  // showMovie(19995).catch( (error) => main.innerHTML = `${error}`);
  // showTv(71912).catch( (error) => main.innerHTML = `${error}`);
  // showPerson(72129).catch( (error) => main.innerHTML = `${error}`);
  // showList('discover', 'movie');

}

// Header ---------------------------------------------------------------------------------------
const createHeader = async () => {
  const logo = new Image(); logo.src = '/IMG/logo.svg'; logo.setAttribute('class', 'logo');
  const logoOverlay = load.div('logo-overlay');
  logoOverlay.onclick = () => startPage();

  const searchForm = document.createElement('form'); searchForm.id = 'search-form';

    const searchFormInput = document.createElement('input');
      searchFormInput.id = 'query'; 
      searchFormInput.type = 'search'; 
      searchFormInput.name = 'query';
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
        }, "10")
      }
      searchFormInput.onblur = () => {
        setTimeout(() => {
        if (document.activeElement.id != 'year') {
          searchOverlay.style.opacity = "0";
          setTimeout(() => {
            searchOverlay.style.display = 'none';
          }, "300")}
        }, '10');
      }
    const searchFormYear = document.createElement('input');
      searchFormYear.id = 'year'; 
      searchFormYear.type = 'text'; 
      searchFormYear.name = 'year';
      searchFormYear.placeholder = 'любой';
      searchFormYear.style.display = 'none';
    const searchFormYearLabel = document.createElement('label');
      searchFormYearLabel.for = 'year';
      searchFormYearLabel.innerHTML = 'год';
      searchFormYearLabel.style.display = 'none';
      
      searchFormYear.onblur = () => {
        setTimeout(() => {
        if (document.activeElement.id != 'query') {
          searchOverlay.style.opacity = "0";
          setTimeout(() => {
            searchOverlay.style.display = 'none';
          }, "300")}
        }, '10');
      }

    const searchFormClrBtn = document.createElement('button');
      searchFormClrBtn.innerHTML = 'close';
      searchFormClrBtn.id = 'clear-btn';
      searchFormClrBtn.setAttribute('class', 'material-symbols-rounded');
      searchFormClrBtn.style.display = 'none'
      searchFormClrBtn.onclick = (event) => {
        event.preventDefault();
        searchFormInput.value = '';
        searchFormYear.value = '';
        searchFormYearLabel.style.display = 'none';
        searchFormYear.style.display = 'none';
        searchFormClrBtn.style.display = 'none';
        searchFormInput.classList.remove('text-inside');
        searchFormInput.focus();
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
    }

  return Promise.all([logo, logoOverlay, searchOverlay, searchForm]);
}

// Nav ------------------------------------------------------------------------------------------
const navButton = async (txt, symb, id) => {
  let btn = document.createElement('div');
  let title = document.createTextNode(txt);
  let iconCont = document.createElement('span');
  let icon = document.createElement('i');
  let symbol = document.createTextNode(symb);
  icon.setAttribute('class', 'material-symbols-rounded');
  document.fonts.load("24px Material Symbols Rounded").then( () => icon.appendChild(symbol));
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
    btn.classList.add('nav-active');
    history.pushState( btn.id, '', btn.id );
    switch (btn.id) {
      case 'movie': document.querySelector('input').placeholder = 'Поиск фильмов'; document.querySelector('input').setCustomValidity('Введите название фильма'); movieMenuList(); break;
      case 'tv': document.querySelector('input').placeholder = 'Поиск сериалов'; document.querySelector('input').setCustomValidity('Введите название сериала'); tvMenuList(); break;
      case 'person': document.querySelector('input').placeholder = 'Поиск знаменитостей'; document.querySelector('input').setCustomValidity('Введите имя знаменитости'); personMenuList(); break;
    }
    if (document.querySelector('input').value != '') { 
      const searchData = new FormData(document.getElementById('search-form'));  
      searchMedia(searchData.get('query'), searchData.get('year'), btn.id).catch( () => main.innerHTML = '¯\_(ツ)_/¯');
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

// Start page -----------------------------------------------------------------------------------
const startPage = async () => {
  main.innerHTML = '';
  main.setAttribute('class', 'start');

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
  let voteAverage = load.votesCircle(media.vote_average, 25, 30, 'votes', media.vote_count);
  let tileOverlay = document.createElement('div'); tileOverlay.setAttribute('class','tile-overlay');

  tileOverlay.onclick = () => {
    switch (type) {
      case 'movie': showMovie(media.id).catch( (error) => main.innerHTML = `${error}`); break;
      case 'tv': showTv(media.id).catch( (error) => main.innerHTML = `${error}`); break;
      case 'person': showPerson(media.id).catch( (error) => main.innerHTML = `${error}`); break;
  }}

  return Promise.all([poster, titles, releaseDate, voteAverage, tileOverlay]);
}

// Search ---------------------------------------------------------------------------------------
const searchMedia = async (query, year, type, page) => {
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
  load.tileLoadingAnimation(data.results.length); //return;

  if (data.page == 'error') { main.innerHTML = `Ошибка PHP cURL запроса: ${data.error}`; return; }
  if (data.results.length == 0) { load.nothingFound().then((cont) => { main.innerHTML = ''; main.append(cont); return; } )}

  let tiles = await Promise.all(data.results.map( async (movie) => {
    let tile = document.createElement('div'); 
    tile.setAttribute('class','tile no-select');

    let cont = await tileContent(movie, type);
    if (!cont[0]) return;
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  if (!page) {
    main.scrollTop = 0;
    main.innerHTML = '';
    tiles.map((tile) => { if (tile) main.append(tile) } );
  } else {
    Array.from(document.getElementsByClassName('loading')).forEach( (element) => { main.removeChild(element) });
    tiles.map((tile) => { if (tile) main.append(tile) } );
  }

  if (data.total_pages > 1) {
    if (!page || page < data.total_pages) {
      let loadMore = document.createElement('div'); loadMore.setAttribute('id', 'load-more');
      let iconLoadMore = load.text('arrow_circle_right', 'icon-load-more material-symbols-rounded');
      if (!page) page = 1;
      let pages = data.total_pages - page;
      let textLoadMore = load.text(`Еще ${pages}`, 'text-load-more');
      (await Promise.all([iconLoadMore, textLoadMore])).map((el) => { if (el) loadMore.append(el)});
      main.append(loadMore);

      main.onscroll = () => {
        if (main.classList.contains('search') && ((main.offsetHeight + main.scrollTop + 400) >= main.scrollHeight)) {
          loadMore.innerHTML = '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
          let nextpage = page + 1;
          main.onscroll = () => {};
          searchMedia(query, year, type, nextpage);
        }  
      }
    } else { main.onscroll = () => {} }
  }
}

// Discover ------------------------------------------------------------------------------------
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
      showList('list', 'movie', element.id);
    }
  });
}

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
      showList('list', 'tv', element.id);
    }
  });

}

const personMenuList = async () => {
  let cont = document.getElementById('nav-menu-list');
  cont.innerHTML = '';
}

export const showList = async (a, type, list, page) => {
  let sort = document.getElementById('filters-sort');
  let order = document.getElementById('filters-order');
  let minRating = document.getElementById('min-rating'); // vote_average.gte
  let maxRating = document.getElementById('max-rating'); // vote_average.lte
  let minVotes = document.getElementById('min-votes'); // vote_count.gte
  let maxVotes = document.getElementById('max-votes'); // vote_count.lte 
  let minDate = document.getElementById('min-year'); // primary_release_date.gte
  let maxDate = document.getElementById('max-year'); // primary_release_date.lte 
  
  let sortBy = `&sort_by=${sort.value}.${order.value}`;
  let discover_vars = sortBy;
  if (minRating.value) discover_vars = discover_vars.concat(`&vote_average_gte=${minRating.value}`);
  if (maxRating.value) discover_vars = discover_vars.concat(`&vote_average_lte=${maxRating.value}`);
  if (minVotes.value) discover_vars = discover_vars.concat(`&vote_count_gte=${minVotes.value}`);
  if (maxVotes.value) discover_vars = discover_vars.concat(`&vote_count_lte=${maxVotes.value}`);
  if (minDate.value) discover_vars = discover_vars.concat(`&primary_release_date_gte=${minDate.value}`);
  if (maxDate.value) discover_vars = discover_vars.concat(`&primary_release_date_lte=${maxDate.value}`);

  if (!page) {
    load.fetchAnimation(); main.style.overflow = 'hidden';
    if (a == 'list') var req = `t=${type}&l=${list}`;
    if (a == 'discover') var req = `t=${type}${discover_vars}`;
  } else {
    if (a == 'list') var req = `t=${type}&l=${list}&p=${page}`;
    if (a == 'discover') var req = `t=${type}${discover_vars}&page=${page}`;
  }

  let response = await fetch(`https://kz.srrlab.ru/${a}/?${req}`);
  const data = await response.json();    // console.log(data);

  if (!page) { main.innerHTML = ''; main.style = null; } else if (document.getElementById('load-more')) { main.removeChild(document.getElementById('load-more')); }
  main.setAttribute('class', 'search');
  load.tileLoadingAnimation(data.results.length); //return;

  if (data.page == 'error') { main.innerHTML = `Ошибка PHP cURL запроса: ${data.error}`; return; }
  if (data.results.length == 0) { load.nothingFound().then((cont) => { main.innerHTML = ''; main.append(cont); return; } )}

  let tiles = await Promise.all(data.results.map( async (movie) => {
    let tile = document.createElement('div'); 
    tile.setAttribute('class','tile no-select');

    let cont = await tileContent(movie, type);
    if (!cont[0]) return;
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  if (!page) {
    main.scrollTop = 0;
    main.innerHTML = '';
    tiles.map((tile) => { if (tile) main.append(tile) } );
  } else {
    Array.from(document.getElementsByClassName('loading')).forEach( (element) => { main.removeChild(element) });
    tiles.map((tile) => { if (tile) main.append(tile) } );
  }

  if (data.total_pages > 1) {
    if (!page || page < data.total_pages) {
      let loadMore = document.createElement('div'); loadMore.setAttribute('id', 'load-more');
      let iconLoadMore = load.text('arrow_circle_right', 'icon-load-more material-symbols-rounded');
      if (!page) page = 1;
      let pages = data.total_pages - page;
      let textLoadMore = load.text(`Еще ${pages}`, 'text-load-more');
      (await Promise.all([iconLoadMore, textLoadMore])).map((el) => { if (el) loadMore.append(el)});
      main.append(loadMore);

      main.onscroll = () => {
        if (main.classList.contains('search') && ((main.offsetHeight + main.scrollTop + 400) >= main.scrollHeight)) {
          loadMore.innerHTML = '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
          let nextpage = page + 1;
          main.onscroll = () => {};
          showList(a, type, list, nextpage);
        }  
      }
    } else { main.onscroll = () => {} }
  }
}

// Movie ----------------------------------------------------------------------------------------
export const showMovie = async (id) => {
  load.fetchAnimation(); main.style.overflow = 'hidden';

  const response = await fetch(`https://kz.srrlab.ru/movie/?id=${id}`);

  const movie = await response.json(); // console.log(movie);
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

  if (movie.belongs_to_collection) {
    var collection = load.movieCollection(movie.belongs_to_collection);
  }

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
  for (let i = 0; i < movie.credits.cast.length; i++) {
    load.actor(movie.credits.cast[i].profile_path, movie.credits.cast[i].name, movie.credits.cast[i].character, movie.credits.cast[i].id).then( tile => { if (tile) actors.append(tile)});
    if (i == 10) break;
  }
  
  let content = await Promise.all([style, poster, backdrop, backdropOverlay, titles, genres, tagline, overview, status, budget, revenue,
                      releaseDate, voteTile, voteAverage, voteCount, crew, actors, videos, collection]);

  main.innerHTML = '';
  main.style = null;
  main.scrollTop = 0;
  main.setAttribute('class','movie');
  content.map((el) => { if (el) main.append(el) });

  let suggested = document.createElement('div'); suggested.setAttribute('class', 'movie-suggested');

  let tiles = await Promise.all(movie.recommendations.results.map( async (movie) => {
    let tile = document.createElement('div'); tile.setAttribute('class','tile no-select');
      let poster = load.image(movie.poster_path, 'poster');
      let titles = document.createElement('div'); titles.setAttribute('class', 'titles');
        let title = load.text(movie.title, 'title'); 
        let originalTitle = load.text(movie.original_title, 'original-title');
        (await Promise.all([title, originalTitle])).map((el) => { if (el) titles.append(el)});
      let voteAverage = load.votesCircle(movie.vote_average, 25, 30, 'votes', movie.vote_count);
      let tileOverlay = document.createElement('div'); 
        tileOverlay.setAttribute('class','tile-overlay');
        tileOverlay.onclick = () => showMovie(movie.id).catch( (error) => main.innerHTML = `${error}`);
    (await Promise.all([poster, titles, voteAverage, tileOverlay])).map((el) => { if (el) tile.append(el) } );
    return tile;
  }));

  tiles.map( (el) => suggested.append(el) );
  main.append(suggested);

}

// TV -------------------------------------------------------------------------------------------
export const showTv = async (id) => {
  load.fetchAnimation(); main.style.overflow = 'hidden';

  const response = await fetch(`https://kz.srrlab.ru/tv/?id=${id}`);
  const tv = await response.json();   // console.log(tv);
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
  let specials; if (tv.seasons[0].name.includes('Спецматериалы')) specials = tv.seasons.shift(); // special episodes are useless, IMHO
  let seasonsTiles = await Promise.all(tv.seasons.map( (season) => load.seasonTile(tv.id, season)));
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

  let suggested = document.createElement('div'); suggested.setAttribute('class', 'tv-suggested');
  let tiles = await Promise.all(tv.recommendations.results.map( async (tv) => {
    let tile = document.createElement('div'); tile.setAttribute('class','tile no-select');
      let poster = load.image(tv.poster_path, 'poster');
      let title = load.text(tv.name, 'title'); 
      let voteAverage = load.votesCircle(tv.vote_average, 25, 30, 'votes', tv.vote_count);
      let tileOverlay = document.createElement('div'); 
        tileOverlay.setAttribute('class', 'tile-overlay');
        tileOverlay.onclick = () => showTv(tv.id).catch( (error) => main.innerHTML = `${error}`);
    (await Promise.all([poster, title, voteAverage, tileOverlay])).map((el) => { if (el) tile.append(el) } );
    return tile;
  }));

  tiles.map( (el) => suggested.append(el) );
  main.append(suggested);
}

// People ---------------------------------------------------------------------------------------
export const showPerson = async (id) => {
  load.fetchAnimation(); main.style.overflow = 'hidden';

  const response = await fetch(`https://kz.srrlab.ru/person/?id=${id}`);
  const person = await response.json();    // console.log(person);
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
  let birthday = load.personBirthday(person.birthday, 'person-birthday');
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

    let cont = await tileContent(movie, 'movie');
    if (cont[3].classList.contains('low-votes')) return; // remove movies with low votes 
    cont.map((el) => { if (el) tile.append(el) } );

    return tile;
  }));

  let movies = load.div('person-movies');
  MovieTiles.map((tile) => { if (tile) movies.append(tile) } );
  let tvs = load.div('person-tvs');
  TvTiles.map((tile) => { if (tile) tvs.append(tile) } );

  let content = await Promise.all([poster, name, birthday, biography, movies, tvs]);

  main.innerHTML = '';
  main.style = null;
  main.scrollTop = 0;
  main.setAttribute('class','person');
  content.map((el) => { if (el) main.append(el) });
}

// Browser history   
// history.pushState( btn, '', btn );     
// window.onpopstate = () => { loadMain(history.state); };
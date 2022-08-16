import '/DEV/vibrant.min.js';
import { showMovie, showTv, showPerson, discover } from '/DEV/app.js';

// Div ------------------------------------------------------------------------------
export const div = (cls, id, container) => {
  let div = document.createElement('div'); 
  if (id) div.setAttribute('id', id);
  if (cls) div.setAttribute('class', cls);
  if (container) container.append(div);

  return div;
}

// Image object ---------------------------------------------------------------------
const proxyImage = (url) => {
  if (!url) return;
  let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';

  return(googleProxyURL + encodeURIComponent(url));
}

export const image = async (path, cls) => {
    if (path) {
      if (cls == 'backdrop') {
        var url = proxyImage(`https://image.tmdb.org/t/p/w1280${path}`);
      } else if (cls == 'movie-poster' || cls == 'tv-season-poster' || cls == 'tv-episode-still') {
        var url = proxyImage(`https://image.tmdb.org/t/p/w500${path}`);
      } else if (cls == 'poster') {
        var url = proxyImage(`https://image.tmdb.org/t/p/w342${path}`);
      } else if (cls == 'collection-poster' || cls == 'movie-actor-img' || cls == 'movie-collection-poster' || cls == 'test-img') {
        var url = proxyImage(`https://image.tmdb.org/t/p/w154${path}`);
      } else {
        var url = proxyImage(`https://image.tmdb.org/t/p/original${path}`);
      }
    } else if (cls == 'poster' || cls == 'movie-actor-img' || cls == 'tv-season-poster') {
      var url = '/IMG/no_poster.svg';
    } else return;
    
    return new Promise( (res) => {
        let img = new Image();
        img.src = url;
        img.setAttribute('class', cls);
        img.onload = () => {
            res(img);
        }
    })
}

// Vibrant styles generated inside <styles> -----------------------------------------
export const vibrantStyles = async (path) => {
  let style = document.createElement('style');
  
  Vibrant.from(proxyImage(`https://image.tmdb.org/t/p/w92${path}`)).getPalette().then( palette => {
    
    let rgb = palette.Vibrant.getRgb();
    let rgbD = palette.DarkVibrant.getRgb();
    let rgbL = palette.LightVibrant.getRgb();
  
    style.innerHTML = `
    .movie-backdrop-overlay, .tv-backdrop-overlay {
      background: linear-gradient(to right, 
        rgb(${rgbD[0]}, ${rgbD[1]}, ${rgbD[2]}) 500px, 
        rgba(${rgbD[0]}, ${rgbD[1]}, ${rgbD[2]}, 0.8));
    }
    .movie, .tv {
      background: linear-gradient(0,
        rgba(${rgbL[0]}, ${rgbL[1]}, ${rgbL[2]}, 0.1), 
        rgba(${rgbL[0]}, ${rgbL[1]}, ${rgbL[2]}, 0.1)),
        var(--md-sys-color-surface);
    }`;
  });

  return style;
}

// Text inside div ------------------------------------------------------------------
export const text = async (text, cls, id) => {
    if (!text) return;
    let container = document.createElement('div');
    let txt = document.createTextNode(text);
    container.appendChild(txt);
    if (cls) container.setAttribute('class', cls);
    if (id) container.setAttribute('id', id);
    
    return container;
}

// Date in russian format -----------------------------------------------------------
export const date = async (date, cls) => {
    if (date == undefined) return;
    let container = document.createElement('div');
    container.setAttribute('class', cls);
  
    if (date != '') {
      let usDate = new Date(date); 
      let localDate = usDate.toLocaleString('ru',{ year: 'numeric', month: 'long', day: 'numeric' });
      let txt = document.createTextNode(localDate);
      container.appendChild(txt);
    } else { 
      let localDate = 'будет объявлена';
      let txt = document.createTextNode(localDate);
      container.appendChild(txt);
    }
  
    return container;
}

// Link with img inside -------------------------------------------------------------
export const imgLink = async (imgSrc, imgWidth, url, cls) => {
    let link = document.createElement('a');
    let logo = new Image(imgWidth);
    logo.src = imgSrc;
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('class', cls);
    link.appendChild(logo);
        
    return link;
}

// convert to USD currency ----------------------------------------------------------
export const formatUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

// Release status--------------------------------------------------------------------
export const mediaStatus = (status) => {
    switch (status) {
      case 'Rumored': return 'Слухи';
      case 'Planned': return 'Запланирован';
      case 'In Production': return 'На стадии производства';
      case 'Post Production': return 'На стадии постпродакшена';
      case 'Released': return 'Вышел в прокат';
      case 'Canceled': return 'Отменен';
      case 'Ended': return 'Закончен';
      case 'Returning Series': return 'Серии выходят';
    }
}

// Videos related to media ----------------------------------------------------------
export const mediaVideos = async (data) => {
  let videosContainer = document.createElement('div'); videosContainer.setAttribute('class', 'videos-container');
  if (data.results.length == 0) {
    let noVideo = await text('Нет видео', 'movie-no-videos');
    videosContainer.append(noVideo);
  } else {
    let videos = data.results;
    videos.map( async (video) => {
      let videoContainer = document.createElement('div'); videoContainer.setAttribute('class', 'video');
        let videoName = await text(video.name, 'video-name');
        let videoFrame = document.createElement('iframe'); videoFrame.setAttribute('class', 'video-frame');
        videoFrame.src = `https://www.youtube.com/embed/${video.key}`;
        videoContainer.append(videoFrame, videoName);
        videosContainer.append(videoContainer);
    });
  }
  return videosContainer;
}

// Media rating inside SVG circle -------------------------------------------------------
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
}
const createArc = (x, y, radius, startAngle, endAngle) => {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");
  
    return d; 
}

export const votesCircle = async (votes, rad, center, cls, vote_count) => {
    if (votes == 100) return;
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    let arc = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  
    let outer, inner;
    switch (true) {
      case (votes == 0): outer = '#143961'; inner = '#143961'; break;
      case (votes < 4): outer = '#571435'; inner = '#db2360'; break;
      case (votes < 7): outer = '#423d0f'; inner = '#d2d531'; break;
      case (votes <= 10): outer = '#204529'; inner = '#21d07a'; break;
    }
    let circlePercent = 36 * votes - 1;
  
    svg.setAttribute("aria-hidden","true");
    svg.setAttribute('class', `no-select ${cls}`);
    if (vote_count < 100) svg.classList.add("low-votes");
  
    circle.setAttribute('cx', center);
    circle.setAttribute('cy', center);
    circle.setAttribute('r', rad);
    circle.setAttribute('class', 'circle');
    circle.setAttribute('stroke', outer);
  
    arc.setAttribute("d", createArc(center, center, rad, 0, circlePercent));
    arc.setAttribute('stroke', inner);
    arc.setAttribute('class', 'arc');
  
    text.setAttribute('x', '50%');
    text.setAttribute('y', '65%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'vote-average');
  
    if (votes == 0 || votes == undefined) {
      text.innerHTML = '-'; 
    } else if (votes == 10) {
      text.innerHTML = '10'; 
    } else {
      text.innerHTML = votes.toFixed(1);
    };
  
    svg.append(circle, arc, text);
    return svg;
}

// Element shows that nothing is found on query -------------------------------------
export const nothingFound = async () => {
  document.body.querySelector('main').removeAttribute('class');
  let cont = document.createElement('div'); cont.setAttribute('class', 'nothing-found');

  let logo = await text(`search_off`, `material-symbols-rounded nothing-found-icon`);
  let txt = await text(`Ничего не найдено`, `nothing-found-text`);

  cont.append(logo, txt);
  return cont;
}

// Actors starred -------------------------------------------------------------------
export const actor = async (img, name, character, id) => {
  let cont = document.createElement('div'); cont.setAttribute('class', 'movie-actor');

  let i = image(img, 'movie-actor-img');
  let n = text(name, 'movie-actor-name');
  let c = text(character, 'movie-actor-character');

  (await Promise.all([i, n, c])).map( el => cont.append(el));

  cont.onclick = () => {
    showPerson(id);
    history.pushState( { type: 'person', id: id}, '', '/person#' + id );
  }
  return cont;
}

// Tiles loading animation ----------------------------------------------------------
export const tileLoadingAnimation = async (qtt) => {
  for (let i = 0; i < qtt; i++) {
    let ani = document.createElement('div'); ani.setAttribute('class', 'tile no-select loading');
    ani.innerHTML = '<div class="poster"></div><div class="titles"></div><div class="release-date"></div><div class="votes"></div>';
  document.body.querySelector('main').append(ani);
  }
}

// Animation while fetching JSON ----------------------------------------------------
export const fetchAnimation = async () => {
  let ani = div('', 'fetch-animation');
  ani.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
  ani.style.top = `${document.querySelector('main').scrollTop}px`;
  document.body.querySelector('main').append(ani);
  setTimeout(() => {
    ani.style.opacity = '1';
  }, 1);
}

// TV season tile and overlay with episodes -----------------------------------------
export const seasonTile = async (tv_id, season) => {
  let tileContainer = div('tv-season-contaner');
  let tile = div('tv-season');
  let poster = image(season.poster_path, 'tv-season-poster');

  let seasonNumber = text(`${season.season_number}`, 'tv-season-number');
  let title = text(season.name, 'tv-season-name'); 

  let episodeCount = text(`Серий ${season.episode_count}`, 'tv-season-episode-count');
  let tileOverlay = div('tv-season-overlay');

  tileOverlay.onclick = async () => {
    if (tile.classList.contains('episodes')) return;

    tile.classList.add('episodes');
    tile.style.top = `${document.querySelector('main').scrollTop + 25}px`;
    document.querySelector('main').style.overflow = 'hidden';
    if (!season.overview) season.overview = 'Нет обзора';
    let overview = await text(season.overview, 'tv-season-overview');
    let closeBtn = await text('cancel', 'tv-season-close-btn material-symbols-rounded');
    closeBtn.onclick = () => {
      tile.removeChild(episodes);
      tile.classList.remove('episodes');
      document.querySelector('main').style = null;
      tile.style = null;
    }

    const response = await fetch(`https://kz.srrlab.ru/tv/season/?id=${tv_id}&n=${season.season_number}`);
    const seasonEpisodes = await response.json(); console.log(seasonEpisodes);

    let episodes = div('no-select', 'tv-episodes-container');
    if (overview) episodes.append(overview);
    episodes.append(closeBtn);

    let episodeTiles = await Promise.all(seasonEpisodes.episodes.map( async (episode) => {
      let episodeTile = div('tv-episode');
        let still = image(episode.still_path, 'tv-episode-still');
        let number = text(`Серия ${episode.episode_number}`, 'tv-episode-number');
        let title = text(episode.name, 'tv-episode-title');
        let overview = text(episode.overview, 'tv-episode-overview');
        let onAir = date(episode.air_date, 'tv-episode-air-date');
      (await Promise.all([still, number, title, overview, onAir])).map((el) => { if (el) episodeTile.append(el) } );
      return episodeTile;
    }));
  
    episodeTiles.map( (el) => episodes.append(el) );
    tile.append(episodes);
    setTimeout(() => {
      episodes.style.opacity = "1";
    }, "100")
  }

  (await Promise.all([poster, seasonNumber, title, episodeCount, tileOverlay])).map((el) => { if (el) tile.append(el) } );
  tileContainer.append(tile);
  return tileContainer;
}

// Movie collection sort by release date --------------------------------------------
const sortByDate = (content) => {
  content.sort( (a, b) => {             
    let fist = a.release_date; if (fist == '') fist = '2100-01-01';
    let second = b.release_date; if (second == '') second = '2100-01-01';
    if (fist < second) { return -1; }
    if (fist > second) { return 1; }
    return 0;
  });
}
// Movie Collection -----------------------------------------------------------------
export const movieCollection = async (collection) => {
  let tile = div('movie-collection');

  let poster = image(collection.poster_path, 'movie-collection-poster');
  let title = text(collection.name, 'movie-collection-name'); 
  let tileOverlay = div('movie-collection-overlay');

  tileOverlay.onclick = async () => {
    if (tile.classList.contains('parts')) return;

    tile.classList.add('parts'); 
    tile.style.top = `${document.querySelector('main').scrollTop}px`;
    document.querySelector('main').style.overflow = 'hidden';
    let closeBtn = await text('cancel', 'movie-collection-close-btn material-symbols-rounded');
    closeBtn.onclick = () => {
      tile.removeChild(parts);
      tile.classList.remove('parts');
      document.querySelector('main').style = null;
      tile.style = null;
    }

    const response = await fetch(`https://kz.srrlab.ru/collection/?id=${collection.id}`);
    const collections = await response.json();
    sortByDate(collections.parts);

    let parts = div('no-select', 'parts-container');
    parts.append(closeBtn);
    tile.append(parts);

    let partTiles = await Promise.all(collections.parts.map( async (part) => {
      let partTile = div('tile no-select'); 
        let poster = image(part.poster_path, 'poster');
        let titles = div('titles');
          let title = text(part.title, 'title'); 
          let originalTitle = text(part.original_title, 'original-title');
          (await Promise.all([title, originalTitle])).map((el) => { if (el) titles.append(el)});
        let releaseDate = date(part.release_date, 'release-date');
        let voteAverage = votesCircle(part.vote_average, 25, 30, 'votes', part.vote_count);
        let tileOverlay = div('tile-overlay');
        tileOverlay.onclick = () => {
          tile.removeChild(parts);
          tile.classList.remove('parts');
          document.querySelector('main').style = null;
          showMovie(part.id).catch( (error) => main.innerHTML = `${error}`);
          history.pushState( { type: 'movie', id: part.id}, '', '/movie#' + part.id );
        }
        (await Promise.all([poster, titles, releaseDate, voteAverage, tileOverlay])).map((el) => { if (el) partTile.append(el) } );

      return partTile;
    }));
  
    partTiles.map((tile) => { if (tile) { parts.append(tile); setTimeout(() => { tile.style.opacity = '1';}, 10) }});

  }

  (await Promise.all([poster, title, tileOverlay])).map((el) => { if (el) tile.append(el) } );
  return tile;
}

// Person birthday and age ----------------------------------------------------------
export const personBirthday = async (birthday, cls) => {
  let cont = div(cls);
  let today = new Date();
  let birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  let localDate = birthDate.toLocaleString('ru',{ year: 'numeric', month: 'long', day: 'numeric' });
  let formatedBirthday = `${localDate} (${age})`
  
  cont.append(formatedBirthday);
  return cont;
}

// Discover filters -----------------------------------------------------------------
export const filters = async (type) => {
  let cont = div('filters no-select');

  //sort
  let sortCont = div('sort-container');
  let sort = document.createElement('select'); 
    sort.id = 'filters-sort';
    sort.onchange = () => btn.classList.add('ready');

  let options = {
    'popularity': 'по популярности',
    'revenue': 'по сборам', 
    'primary_release_date': 'по дате выхода', 
    'original_title': 'по оригинальному названию', 
    'vote_average': 'по рейтингу', 
    'vote_count': 'по количеству голосов'
  }

  Object.entries(options).forEach(([key, value]) => {
    let option = document.createElement('option'); option.value = key; option.innerHTML = value; sort.append(option);
  });

  let order = document.createElement('select'); order.id = 'filters-order';
  let desc = document.createElement('option'); desc.value = 'desc'; desc.innerHTML = 'по убыванию'; order.append(desc);
    let asc = document.createElement('option'); asc.value = 'asc'; asc.innerHTML = 'по возрастанию'; order.append(asc);
    order.onchange = () => btn.classList.add('ready');
  
  sortCont.append(sort, order);

  // rating
  let ratingCont = div('rating-container');
  let minRating = document.createElement('input');
    minRating.type = 'number';
    minRating.id = 'min-rating';
    minRating.name = 'min_rating';
    minRating.placeholder = '0';
    minRating.min = 0; minRating.max = 10;
    minRating.onchange = () => btn.classList.add('ready');
  let minRatingLabel = document.createElement('label');
    minRatingLabel.for = 'min-rating';
    minRatingLabel.innerHTML = 'от';
  
  let maxRating = document.createElement('input');
    maxRating.type = 'number';
    maxRating.id = 'max-rating';
    maxRating.name = 'max_rating';
    maxRating.placeholder = '10';
    maxRating.min = 0; maxRating.max = 10;
    maxRating.onchange = () => btn.classList.add('ready');
  let maxRatingLabel = document.createElement('label');
    maxRatingLabel.for = 'max-rating';
    maxRatingLabel.innerHTML = 'до';
    
  ratingCont.append(minRatingLabel, minRating, maxRatingLabel, maxRating); 

  // votes
  let votesCont = div('votes-container');
  let minVotes = document.createElement('input');
    minVotes.type = 'number';
    minVotes.id = 'min-votes';
    minVotes.name = 'min_votes';
    minVotes.placeholder = '0';
    minVotes.min = 0; minVotes.max = 100000;
    minVotes.onchange = () => btn.classList.add('ready');
  let minVotesLabel = document.createElement('label');
    minVotesLabel.for = 'min-votes';
    minVotesLabel.innerHTML = 'от';
  
  let maxVotes = document.createElement('input');
    maxVotes.type = 'number';
    maxVotes.id = 'max-votes';
    maxVotes.name = 'max_votes';
    maxVotes.placeholder = '40000';
    maxVotes.min = 0; maxVotes.max = 99999;
    maxVotes.onchange = () => btn.classList.add('ready');
  let maxVotesLabel = document.createElement('label');
    maxVotesLabel.for = 'max-votes';
    maxVotesLabel.innerHTML = 'до';
  
  votesCont.append(minVotesLabel, minVotes, maxVotesLabel, maxVotes);

  // year 
  let yearCont = div('year-container');
  let minYear = document.createElement('input');
    minYear.type = 'date';
    minYear.id = 'min-year';
    minYear.name = 'min_year';
    minYear.required = true;
    minYear.onchange = () => {btn.classList.add('ready'); console.log(minYear.value)}
  let minYearLabel = document.createElement('label');
    minYearLabel.for = 'min-year';
    minYearLabel.innerHTML = ' с';
  
  let maxYear = document.createElement('input');
    maxYear.type = 'date';
    maxYear.id = 'max-year';
    maxYear.name = 'max_year';
    maxYear.required = true;
    maxYear.onchange = () => btn.classList.add('ready');
  let maxYearLabel = document.createElement('label');
    maxYearLabel.for = 'max-year';
    maxYearLabel.innerHTML = 'по';
  
  yearCont.append(minYearLabel, minYear, maxYearLabel, maxYear);
   
  // submit btn
  let btn = div('', 'filters-submit-btn');
  btn.innerHTML = 'Подобрать';
  btn.onclick = () => {
    discover('discover', type);
    btn.classList.remove('ready');
    history.pushState( { 
      type: type,
      sort: sort.value, 
      order: order.value,
      minRating: minRating.value,
      maxRating: maxRating.value,
      minVotes: minVotes.value,
      maxVotes: maxVotes.value,
      minYear: minYear.value,
      maxYear: maxYear.value
    }, '', '/' + type + '?discover');
  }

  ([sortCont, ratingCont, votesCont, yearCont, btn]).map( (el) => cont.append(el));
  return cont;
}

export const setFilters = (sort, order, minRating, maxRating, minVotes, maxVotes, minDate, maxDate) => {
  if (sort) document.getElementById('filters-sort').value = sort;
  if (order) document.getElementById('filters-order').value = order;
  if (minRating) document.getElementById('min-rating').value = minRating;
  if (maxRating) document.getElementById('max-rating').value = maxRating;
  if (minVotes) document.getElementById('min-votes').value = minVotes;
  if (maxVotes) document.getElementById('max-votes').value = maxVotes;
  if (minDate) document.getElementById('min-year').value = minDate;
  if (maxDate) document.getElementById('max-year').value = maxDate;
}
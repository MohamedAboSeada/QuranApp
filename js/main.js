const bitrate = "128";
const edition = "ar.alafasy";
const baseURL = `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/`;
const surahsURL = "http://api.alquran.cloud/v1/surah";

const surahsList = document.querySelector('.surahs ul');
const ayahSelect = document.getElementById('ayah-select');
const audio = document.querySelector('audio');
const surahName = document.getElementById('surah-name');
const ayahText = document.getElementById('ayah-text');
const Translate = document.getElementById('ayah-translation');
const reciter = document.getElementById('reciter');
const play = document.getElementById('play');
const pause = document.getElementById('pause');

let selectedAyahIndex = 0;
// make audio player


// populate surah list
fetch(surahsURL)
  .then(response => response.json())
  .then(data => {
    data.data.forEach(surah => {
      const li = document.createElement('li');
      li.textContent = `${surah.name}`;
      li.setAttribute('data-surah', surah.number);
      surahsList.appendChild(li);
    });
  })
  .catch(error => console.log(error));


// listen for surah selection
surahsList.addEventListener('click', event => {
  if (event.target.nodeName === 'LI') {
    const surahNumber = event.target.getAttribute('data-surah');
    const ayatsURL = `http://api.alquran.cloud/v1/surah/${surahNumber}`;
    let surah = surahNumber;
    // reset ayah select and details
    ayahSelect.innerHTML = '<option value="" selected disabled>اختر الايه</option>';
    ayahSelect.disabled = false;
    audio.src = '';
    surahName.textContent = '';
    ayahText.textContent = '';
    selectedAyahIndex = 0; // set the selected ayah index to 0

    // populate ayah select
    fetch(ayatsURL)
      .then(response => response.json())
      .then(data => {
        data.data.ayahs.forEach((ayah, index) => {
          const option = document.createElement('option');
          option.textContent = `${ayah.numberInSurah}`;
          option.value = ayah.number;
          ayahSelect.appendChild(option);
          if (index === selectedAyahIndex) {
            option.selected = true;
          }
        });
        
        // play the first ayah automatically
        const ayahNumber = ayahSelect.value;
        const ayahURL = `http://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih`;

        fetch(ayahURL)
          .then(response => response.json())
          .then(data => {
            if(surahNumber != 1 && surahNumber != 9){
              audio.src = 'audio/001m.mp3';
              audio.play();
              selectedAyahIndex = 0;
            }else{
              audio.src = `${baseURL}${data.data[0].number}.mp3`;
              audio.play();
              selectedAyahIndex = 1;
            }
            reciter.textContent = "مشاري راشد العفاسي";
            surahName.textContent = `﴾ ${data.data[0].surah.name} ﴿`;
            if(surahNumber > 1){
              ayahText.textContent = data.data[0].text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ","");
            }else{
              ayahText.textContent = data.data[0].text;
            }
            Translate.textContent = data.data[1].text;
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }
});

// listen for ayah selection
ayahSelect.addEventListener('change', event => {
  selectedAyahIndex = event.target.selectedIndex;
  const ayahNumber = event.target.value;
  const ayahURL = `http://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih`;

  // fetch ayah data and play audio
  fetch(ayahURL)
    .then(response => response.json())
    .then(data => {
      audio.src = `${baseURL}${data.data[0].number}.mp3`;
      audio.play();
      reciter.textContent = "مشاري راشد العفاسي";
      surahName.textContent = `﴾ ${data.data[0].surah.name} ﴿`;
      ayahText.textContent = data.data[0].text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ","");
      Translate.textContent = data.data[1].text;
    })
    .catch(error => console.log(error));
});

// listen for audio ended event
audio.addEventListener('ended', event => {
  const options = ayahSelect.options;
    if (selectedAyahIndex < options.length - 1) {
      options[selectedAyahIndex + 1].selected = true;
      selectedAyahIndex++;
      ayahSelect.dispatchEvent(new Event('change'));
    }
});

let paused = false;
let pauseTime;

play.addEventListener('click', Event => {
  if (paused) {
    audio.currentTime = pauseTime;
  }
  audio.play();
  paused = false;
});
pause.addEventListener('click', Event => {
  pauseTime = audio.currentTime;
  audio.pause();
  paused = true;
});

const bar = document.querySelector(".bar");

function updateBar() {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const progress = (currentTime / duration) * 100;
  bar.style.width = progress + "%";
}

audio.addEventListener("canplay", function() {
  setInterval(updateBar, 100);
});

// for surah section
const button = document.getElementById("toggle-button");
const surahClass = document.getElementById("sh");
let isToggled = false;

button.addEventListener("click", function() {
  if (isToggled) {
    sh.style.left = "0";
  } else {
    sh.style.left = "-500px";
  }

  // Flip the toggle state
  isToggled = !isToggled;
});
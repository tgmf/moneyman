<template>
<div>
  <div
    class="background-splash w-screen h-screen fixed"
  />
  <div
    class="background-main w-screen h-screen fixed"
    :class="[ { is_loaded: loaded }, currentSlide['background-color'] ? currentSlide['background-color'] : '' ]"
  />
  <div
    v-if="currentSlide['background-image']"
    class="background-image w-screen h-screen fixed hidden md:block"
    :style="'background-image: url(/img/' + currentSlide['background-image'] + '.png);'"
  />
  <div
    class="header-main relative w-100"
  >
    <div
      class="header-main__logo p-5 md:pt-12 md:pl-16"
    >
      <img
        class="header-main__moneyman m-auto md:m-0 cursor-pointer"
        :data-quest-slide="currentSlide['n']"
        src="/img/logo.svg"
        v-on:click="externalLink('https://moneyman.ru/')"
        />
    </div>
  </div>
  <div class="main px-5">
    <div class="title pt-0">
      <h1 class="title__title pb-1.5">
        Заработай первый миллион
      </h1>
      <div class="title__subtitle">
        Приключения предпринимателя в вымышленном городе
      </div>
    </div>

    <div class="status md:pr-16">
      <div class="status__progress pt-2">
        <div
          class="status__progress__bullet is_active"
          :style="'transform: translateX('+ currentSlide.n * 1.5 + 'em);'"
        />
        <div class="status__progress__bullet"></div><div class="status__progress__bullet"></div><div class="status__progress__bullet"></div><div class="status__progress__bullet"></div><div class="status__progress__bullet"></div><div class="status__progress__bullet"></div><div class="status__progress__bullet"></div>
      </div>
      <div
        class="status__balance rounded-lg md:rounded-3xl px-5 md:pl-10 md:pr-12 pt-4 pb-5 -mb-5 md:pb-20 md:-mb-20"
        :class="[currentSlide['background-color'] ? 'bg-white' : 'bg-green', { 'opacity-0': !balance && !currentResult }]"
      >
        <span>Баланс:</span>&nbsp;<b>{{ balance | toCurrency }}</b>
      </div>
    </div>

    <div class="content relative rounded-lg">
      <div class="background__content w-full h-full absolute rounded-lg md:rounded-3xl">
        <div class="noise__content w-full h-full"/>
      </div>
      <div class="slide w-full h-full relative p-5 flex flex-col justify-center">
        <div
          v-if="!currentResult"
          class="task pt-5 flex flex-col justify-center"
        >
          <div
            v-show="currentSlide.title"
            class="task__title mt-5"
          >
            {{ currentSlide.title }}
          </div>
          <div
            class="task__text mt-5"
            v-html="currentSlide.text"
          />
        </div>
        <div
          v-if="currentSlide.n == 0"
          class="prompts"
        >
          <div
            class="prompt relative balance-prompt"
          >
            <div
              v-if="balance"
              class="absolute text-center w-full pointer-events-none font-medium"
            >
              <span class="text-transparent mr-5">{{ balance }}</span> ₽
            </div>
            <div
              class="absolute w-full text-center pointer-events-none tooltip"
            >
              <span
                v-if="tooltip"
                class="rounded-full font-medium text-white m-auto md:m-0 md:absolute px-4"
              >
                !  Введите данные, чтобы начать игру
              </span>
            </div>
            <input
              type="number"
              v-model.number="balance"
              placeholder="Введите сумму"
              maxlength=12
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              v-on:focus="tooltip = false"
              v-on:keyup.enter="changeSlide()"
              class="block my-16 mx-auto bg-transparent border-b font-medium border-black border-opacity-25 text-center balance-input"
            />
          </div>
        </div>
        <div
          v-if="currentSlide.prompts && !currentResult"
          class="prompts my-10"
        >
          <div
            class="prompt relative mx-auto md:flex md:space-x-6 md:mb-5"
            v-for="(prompt, index) in currentSlide.prompts"
            :key="index"
          >
              <div
                class="prompt__title pt-5 pb-2 md:pb-5 md:bg-white md:rounded-3xl md:flex-1 font-normal"
              >
                {{ prompt.title }}
              </div>
              <div
                class="prompt__input flex justify-between md:pb-5 md:bg-white md:rounded-3xl md:flex-1"
              >
                <div
                  v-if="balance_prompts[index]"
                  class="absolute pointer-events-none font-medium"
                >
                  <span class="text-transparent mr-2">{{ balance_prompts[index] }}</span> ₽
                </div>
                <input
                  type="number"
                  v-model.number="balance_prompts[index]"
                  placeholder="Введите сумму"
                  maxlength=12
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  v-on:focus="tooltip = false"
                  v-on:keyup.enter="changeSlide()"
                  class="inline bg-transparent border-b font-medium border-black border-opacity-25"
                />
                <span>{{ prompt.append }}</span>
              </div>
          </div>
        </div>
        <div
          v-if="currentResult"
          class="result"
        >
          <img
            :src="'/img/' + currentResult.status + '.png'"
            class="m-auto my-10"
          />
          <div
            class="text-center"
            v-html="currentResult.html"
          />
        </div>
        <button
          v-if="currentSlide.nextButton"
          class="rounded-lg md:rounded-3xl p-5 font-light mx-auto mt-auto mb-2 md:mb-10 block w-full next-button"
          :class="currentSlide['background-color'] ? 'bg-white' : 'bg-white md:bg-green'"
          style="max-width: 18em;"
          v-on:click="currentSlide.href ? externalLink(currentSlide.href) : changeSlide()"
        >
          {{ currentSlide.nextButton }}
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false,
      balance: null,
      tooltip: false,
      balance_prompts: [],
      currentSlide: { 'n': 0, 'background-color': 'bg-green', title: "Добро пожаловать!", text: "Пройдя нашу игру вы сможете узнать уровень вашей финансовой грамотности.<br/><br/>Для начала мы просим указать вашу заработную плату за месяц, а также все дополнительные доходы.", nextButton: 'Начать' },
      slides: [ { 'n': 0, 'background-color': 'bg-green', title: "Добро пожаловать!", text: "Пройдя нашу игру вы сможете узнать уровень вашей финансовой грамотности.<br/><br/>Для начала мы просим указать вашу заработную плату за месяц, а также все дополнительные доходы.", nextButton: 'Начать' },
        { 'n': 1, 'background-image': 'pulp', title: false, text: '<p class="font-medium">Внесите сюда регулярные траты, которые даже в случае потери работы вы не сможете уменьшить.</p>', prompts: [ 
          { title: 'Аренда квартиры', placeholder: 'Введите сумму', tooltip: false, append: 'в месяц', },
          { title: 'Кредит', placeholder: 'Введите сумму', tooltip: false, append: 'в месяц', },
          { title: 'Коммунальные платежи', placeholder: 'Введите сумму', tooltip: false, append: 'в месяц', },
          { title: 'Другие траты', placeholder: 'Введите сумму', tooltip: false, append: 'в месяц', } ],
          nextButton: 'Дальше' },
        { 'n': 2, 'background-image': "pulp", text: '<p class="font-medium">Давайте решим как вы питаетесь.<br/>Выберите наиболее подходящий себе рацион.</p>', prompts: [ { title: false, placeholder: 'Введите сумму', tooltip: '!  Введите данные, чтобы начать игру', append: false, } ], },
        { 'n': 3, 'background-color': 'bg-green', 'background-image': false, text: "Пройдя нашу игру вы сможете узнать уровень вашей финансовой грамотности.<br/><br/>Для начала мы просим указать вашу заработную плату за месяц, а также все дополнительные доходы.", prompts: [ { title: false, placeholder: 'Введите сумму', tooltip: '!  Введите данные, чтобы начать игру', append: false, } ], },],
      currentResult: null,
      results: [ {status: 'gameOver', html: '<p>УПС!</p><p>К сожалению, вам не хватило денег на все траты.</p><p>Предлагаем вам взять первый микрозайем <b>под 0% на 30 дней.</b></p>'},
      {status: 'success', html: '<p>Поздравляем!</p><p>Вы умеете грамотно распределять свои средства. На вашем счете осталось <b>14 000 ₽.</b></p><p>Предлагаем вам заняться инвестированием, чтобы приумножить свои финансы.</p>'}, ],
    }
  },
  created() {
    this.loaded = true
  },
  methods: {
    changeSlide() {
      if (!this.balance && this.currentSlide.n == 0) return this.tooltip = true
      if (this.balance_prompts) {
        this.balance = this.balance - this.balance_prompts.reduce((a, b) => a + b, 0)
        this.balance_prompts = []
      }
      if (this.balance <= 0) {
        this.currentSlide.nextButton = 'Перейти'
        this.currentSlide.href = '#'
        return this.currentResult = this.results.find(s => s.status === 'gameOver')
      }
      if (this.currentSlide.n == this.slides.length) {
        this.currentSlide.nextButton = false
        return this.currentResult = this.results.find(s => s.status === 'success')
      }
      return this.currentSlide = this.slides.find(s => s.n === this.currentSlide.n + 1)
    },
    externalLink (link) {
      window.location.href = link;
    }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

@-webkit-keyframes fade_from_bottom {
  0% {
    -webkit-transform: translate3d(0,1.25em,0);
    transform: translate3d(0,1.25em,0);
    opacity: 0
  }

  to {
      -webkit-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
      opacity: 1
  }
}

@keyframes fade_from_bottom {
  0% {
    -webkit-transform: translate3d(0,1.25em,0);
    transform: translate3d(0,1.25em,0);
    opacity: 0
  }

  to {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    opacity: 1
  }
}

@-webkit-keyframes fade_to_top {
  0% {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    opacity: 1
  }

  to {
    -webkit-transform: translate3d(0,-100px,0);
    transform: translate3d(0,-100px,0);
    opacity: 0
  }
}

@keyframes fade_to_top {
  0% {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    opacity: 1
  }

  to {
    -webkit-transform: translate3d(0,-100px,0);
    transform: translate3d(0,-100px,0);
    opacity: 0
  }
}

@-webkit-keyframes fade_to_top_mobile {
  0% {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    opacity: 1
  }

  to {
    -webkit-transform: translate3d(0,-60px,0);
    transform: translate3d(0,-60px,0);
    opacity: 0
  }
}

@keyframes fade_to_top_mobile {
  0% {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    opacity: 1
  }

  to {
    -webkit-transform: translate3d(0,-60px,0);
    transform: translate3d(0,-60px,0);
    opacity: 0
  }
}

@-webkit-keyframes fade_back {
  0% {
    opacity: 0
  }

  to {
    opacity: 1
  }
}

@keyframes fade_back {
  0% {
    opacity: 0
  }

  to {
    opacity: 1
  }
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg)
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg)
}

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg)
  }
}

body {
  margin: 0;
  min-height: 100%;
  background-color: #fff;
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  font-family: 'Roboto','Arial',sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 1.4;
  -ms-touch-action: manipulation;
  touch-action: manipulation;

  @media (min-width: 760px) and (-webkit-min-device-pixel-ratio: 1.25) {
    font-size: .8em;
      
  }

  @media (min-width: 760px) and (-webkit-min-device-pixel-ratio: 1.5) {
    font-size: .666667em;
  }
}

.bg-green {
  background-color: #9EDC16;
}

.md\:bg-green {
    @media (min-width: 760px) {
      background-color: #9EDC16;
    }
}

.header-main {
    text-align: center;

    @media (min-width: 760px) {
      width: 100%;
      position: fixed;
      top: 0;
      display: block;
  }

  .header-main__logo img {
    width: 11.125em;

    @media (min-width: 760px) {
      width: 15.625em;
    }
  }
}

.background-splash {

  
  background: url(/img/splash_top.svg) center top no-repeat, url(/img/splash_bottom.svg) right bottom no-repeat;

  @media screen and (min-width: 760px) {
    background: url(/img/splash.svg) left top no-repeat;
    background-size: cover;  
  }
  
  .splash {
    -webkit-animation: fade_back .3s forwards ease-out;
    animation: fade_back .3s forwards ease-out;
  }
}

.background-main {
  background-image: url("/img/coins.png");
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: contain;

  @media screen and (min-width: 760px) {
    background-size: 35vw;    
  }
}

.background-main.is_loaded {
    -webkit-animation: fade_back .3s forwards ease-out;
    animation: fade_back .3s forwards ease-out;
}

.background-image {
    -webkit-animation: fade_back .3s forwards ease-out;
    animation: fade_back .3s forwards ease-out;
    background-position: right bottom;
    background-repeat: no-repeat;
}

.main {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  max-width: 46em;
  margin: 0 auto;
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  position: relative;
  z-index: 1;
  -ms-flex: 1;
  -webkit-box-flex: 1;
  flex: 1;

  @media screen and (min-width: 760px) {
    -ms-flex: 0 1 auto;
    -webkit-box-flex: 0;
    flex: 0 1 auto;
    padding: 6.5em 1em 2.5em;
  }

  @media screen and (min-width: 1160px) {
      padding-top: 4em;
      max-width: 80em;
  }
}

.title {
    text-align: center;
    padding-bottom: 1.75em;

    @media (min-width: 760px) {
      padding-bottom: 3em;
    }

  .title__title {
    font-weight: 400;
    font-size: 1.25em;

    @media screen and (min-width: 760px) {
      font-size: 3em;
    }

  }

  .title__subtitle {
    line-height: 1.2;

    @media screen and (min-width: 760px) {
      font-size: 1.375em;
    }
  }
}

.status, .status__progress {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
}

.status {
    -ms-flex-align: center;
    -webkit-box-align: center;
    align-items: center;
    margin-bottom: .5em;

  .status__progress__bullet {
      font-size: .625em;
      width: 1em;
      height: 1em;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border: 1px solid black;
      border-radius: 50%;
      margin-right: .5em;
      position: relative;

      @media (min-width: 760px) {
        font-size: 1em;
      }

      &.is_active {
        border-color: #FFA502;
        background-color: #FFA502;
        position: absolute;
        z-index: 0;
        transition: transform 0.5s cubic-bezier(0.49, 2.02, 0.69, 0.74);
      }
  }
}

.answers__price, .result__title__content, .status__balance {
    margin-left: auto;
    white-space: nowrap;
    -webkit-align-self: flex-start;
    -ms-flex-item-align: start;
    align-self: flex-start;
    display: -ms-inline-flexbox;
    display: -webkit-inline-box;
    display: inline-flex;
    -ms-flex-align: center;
    -webkit-box-align: center;
    align-items: center;
    -ms-flex-pack: end;
    -webkit-box-pack: end;
    justify-content: flex-end;
}

.status__balance {
  transition: opacity .2s ease;
  
  span {
    font-size: 0.875em;

    @media (min-width: 760px) {
      font-size: 1.375em;
      line-height: 2;
      margin-right: .5em;
    }
  }

  b {

    @media (min-width: 760px) {
      font-size: 1.875em;
    }
  }
}

.content {

  
  .background__content {
    backdrop-filter: blur(60px);
    -webkit-backdrop-filter: blur(60px);
    background: radial-gradient(90.16% 143.01% at 15.32% 21.04%, rgba(99, 99, 99, 0.2) 0%, rgba(105, 105, 105, 0.0447917) 77.08%, rgba(70, 144, 213, 0) 100%);
    background-blend-mode: normal;

    @media (min-width: 760px) {
      backdrop-filter: blur(80px);
      -webkit-backdrop-filter: blur(80px);
    }
  }

  .noise__content {
    background-image: url(/img/noise.png);
    background-blend-mode: overlay;
    opacity: 0.02;
  }

  .slide { 
    min-height: 60vh;
  }

  .task {
    text-align: center;
    margin: auto;
    letter-spacing: -1px;

    @media (min-width: 760px) {
      font-size: 2em;
    }

    .task__title {
      font-size: 1.25em;
      font-weight: 700;
      line-height: 2;
      letter-spacing: 0;

      @media (min-width: 760px) {
        font-size: 1em;
      }
    }

    .task__text {
      max-width: 25em;
      line-height: 1.2;
    }
  }

  .prompt {

    max-width: 40em;
    
    @media (min-width: 760px) {
      font-size: 1.375em
    }
    
    &.balance-prompt {
      font-size: 1.375em;
    
      @media (min-width: 760px) {
        font-size: 1.875em;
      }
    }

    .prompt__title, .prompt__input {

      @media (min-width: 760px) {
        height: 4em;
        align-items: center;
        padding: 1em;
        line-height: 2;
      }
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  input::placeholder {
    color: rgba(0, 0, 0, 0.5);
    font-size: 0.933333em;
    font-weight: 300;
  }

  .balance-input {

    @media (min-width: 760px) {
      width: 14em;
    }
  }

  :focus-visible {
    outline: none;
    border-color: #FFA502;
  }

  button.bg-white:hover {
    background-color: #FFA502;
  }

  .tooltip {

    top: -2em;

    @media (min-width: 760px) {
      top: -1.5em;
    }

    span{
      font-size: 0.545454em;
      font-weight: 500;
      background-color: #4C4C4C;
      display: block;
      max-width: 22em;
      line-height: 2.5;

      @media (min-width: 760px) {
        left: 62%;
        font-size: 0.6em;
        line-height: 2.2;
      }

      &::before {
        content:'';
        display:block;
        width:0;
        height:0;
        position:absolute;
        border-top: .5em solid #4C4C4C;
        border-right: .5em solid transparent;
        bottom:-.5em;
        left: 50%;

        @media (min-width: 760px) {
          left: 1em;
        }
      }
    }
  }

  .next-button {
    
    @media (min-width: 760px) {
      font-size: 1.375em;
      max-width: 17.636363em
    }
  }

  .result {

    img {
      -webkit-animation: fade_from_bottom .3s forwards ease-out;
      animation: fade_from_bottom .3s forwards ease-out;
    }

    p {
      margin-bottom: 1em;
      max-width: 25em;
      font-weight: 400;
    }
  }
}
</style>
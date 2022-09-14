<template>
  <div class="book-button">
    <p v-if="firstEventTime && !nextEventIncoming">{{ i18n("available-until") }} {{ getHoursMinutes(firstEventTime, clockFormat) }}</p>
    <div v-else-if="nextEventIncoming" class="incoming-text">
      <p>{{ i18n("next-meeting-start-in") }} {{ firstEventTime ? this.currentTime.clone().from(firstEventTime, true) : "" }}</p>
<!--      <div v-if="!options['disable_cancel_meeting_from_screen'] && nextMeeting.meeting_room_status === 'booked'" class="check-in-button" @click="!requesting ? checkIn() : {}">-->
<!--        <p>{{ i18n("check-in-now") }}</p>-->
<!--        <div class="valid-container">-->
<!--          <div v-if="!requesting" class="valid">-->
<!--          </div>-->
<!--          <SpinnerLoader v-else/>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <p v-else class="title">{{ i18n("free-now") }}</p>
    <div v-if="!options['disable_on_the_fly_booking'] && !nextEventIncoming" class="book-button-wrapper">
      <svg class="dots pulse" xmlns="http://www.w3.org/2000/svg" width="514.975" height="514.974"
           viewBox="0 0 514.975 514.974">
        <defs>
          <filter id="Ellipse_10" width="389.1" height="389.1" x="60.708" y="64.196" filterUnits="userSpaceOnUse">
            <feOffset dy="3"/>
            <feGaussianBlur result="blur" stdDeviation="3"/>
            <feFlood flood-color="#25e874"/>
            <feComposite in2="blur" operator="in"/>
            <feComposite in="SourceGraphic"/>
          </filter>
        </defs>
        <g id="Groupe_60" transform="rotate(-7 -2489.682 2567.252)">
          <g filter="url(#Ellipse_10)" transform="rotate(7 -2530.59 2605.393)">
            <circle id="Ellipse_10-2" cx="166.5" cy="166.5" r="166.5" fill="none" opacity="0.427"
                    transform="rotate(-7 940.473 -514.484)"/>
          </g>
          <g id="Groupe_46" transform="translate(260 601.79)">
            <g id="Groupe_44">
              <circle id="Ellipse_14" cx="7.5" cy="7.5" r="7.5" class="cls-2" transform="translate(0 .21)"/>
              <ellipse id="Ellipse_15" cx="6" cy="6.5" class="cls-3" rx="6" ry="6.5" transform="translate(28 1.21)"/>
              <ellipse id="Ellipse_16" cx="4" cy="4.5" class="cls-4" rx="4" ry="4.5" transform="translate(54 3.21)"/>
              <circle id="Ellipse_17" cx="3.5" cy="3.5" r="3.5" class="cls-5" transform="translate(75 4.21)"/>
              <ellipse id="Ellipse_18" cx="2" cy="2.5" class="cls-6" rx="2" ry="2.5" transform="translate(96 5.21)"/>
              <ellipse id="Ellipse_19" cx="1" cy="1.5" class="cls-7" rx="1" ry="1.5" transform="translate(113 6.21)"/>
            </g>
            <g id="Groupe_45" transform="translate(401.75)">
              <circle id="Ellipse_14-2" cx="7.5" cy="7.5" r="7.5" class="cls-2" transform="translate(100.25 .21)"/>
              <ellipse id="Ellipse_15-2" cx="6" cy="6.5" class="cls-3" rx="6" ry="6.5"
                       transform="translate(75.25 1.21)"/>
              <ellipse id="Ellipse_16-2" cx="4" cy="4.5" class="cls-4" rx="4" ry="4.5"
                       transform="translate(53.25 3.21)"/>
              <circle id="Ellipse_17-2" cx="3.5" cy="3.5" r="3.5" class="cls-5" transform="translate(33.25 4.21)"/>
              <ellipse id="Ellipse_18-2" cx="2" cy="2.5" class="cls-6" rx="2" ry="2.5"
                       transform="translate(15.25 5.21)"/>
              <ellipse id="Ellipse_19-2" cx="1" cy="1.5" class="cls-7" rx="1" ry="1.5" transform="translate(.25 6.21)"/>
            </g>
          </g>
          <g id="Groupe_47" transform="rotate(-14.98 2672.033 -679.397)">
            <g id="Groupe_44-2">
              <ellipse id="Ellipse_14-3" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-3" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-3" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-3" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-3" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-3" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-2" transform="translate(401.75)">
              <ellipse id="Ellipse_14-4" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-4" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-4" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-4" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-4" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-4" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_48" transform="rotate(-30 1511.453 -176.561)">
            <g id="Groupe_44-3">
              <ellipse id="Ellipse_14-5" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-5" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-5" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-5" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-5" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-5" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-3" transform="translate(401.75)">
              <ellipse id="Ellipse_14-6" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-6" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-6" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-6" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-6" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-6" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_49" transform="rotate(-45 1114.924 -5.242)">
            <g id="Groupe_44-4">
              <ellipse id="Ellipse_14-7" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-7" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-7" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-7" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-7" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-7" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-4" transform="translate(401.75)">
              <ellipse id="Ellipse_14-8" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-8" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-8" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-8" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-8" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-8" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_50" transform="rotate(-60 909.664 83.439)">
            <g id="Groupe_44-5">
              <ellipse id="Ellipse_14-9" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-9" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-9" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-9" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-9" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-9" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-5" transform="translate(401.75)">
              <ellipse id="Ellipse_14-10" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-10" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-10" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-10" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-10" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-10" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_51" transform="rotate(-74.99 780.688 139.071)">
            <g id="Groupe_44-6">
              <ellipse id="Ellipse_14-11" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-11" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-11" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-11" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-11" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-11" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-6" transform="translate(401.75)">
              <ellipse id="Ellipse_14-12" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-12" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-12" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-12" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-12" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-12" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_52" transform="rotate(-90 689.395 178.605)">
            <g id="Groupe_44-7">
              <circle id="Ellipse_14-13" cx="7.5" cy="7.5" r="7.5" class="cls-2" transform="translate(0 .211)"/>
              <ellipse id="Ellipse_15-13" cx="6" cy="6.5" class="cls-3" rx="6" ry="6.5"
                       transform="translate(28 1.211)"/>
              <ellipse id="Ellipse_16-13" cx="4" cy="4.5" class="cls-4" rx="4" ry="4.5"
                       transform="translate(54 3.211)"/>
              <circle id="Ellipse_17-13" cx="3.5" cy="3.5" r="3.5" class="cls-5" transform="translate(75 4.211)"/>
              <ellipse id="Ellipse_18-13" cx="2" cy="2.5" class="cls-6" rx="2" ry="2.5"
                       transform="translate(96 5.211)"/>
              <ellipse id="Ellipse_19-13" cx="1" cy="1.5" class="cls-7" rx="1" ry="1.5"
                       transform="translate(113 6.211)"/>
            </g>
            <g id="Groupe_45-7" transform="translate(401.75)">
              <circle id="Ellipse_14-14" cx="7.5" cy="7.5" r="7.5" class="cls-2" transform="translate(100.25 .211)"/>
              <ellipse id="Ellipse_15-14" cx="6" cy="6.5" class="cls-3" rx="6" ry="6.5"
                       transform="translate(75.25 1.211)"/>
              <ellipse id="Ellipse_16-14" cx="4" cy="4.5" class="cls-4" rx="4" ry="4.5"
                       transform="translate(53.25 3.211)"/>
              <circle id="Ellipse_17-14" cx="3.5" cy="3.5" r="3.5" class="cls-5" transform="translate(33.25 4.211)"/>
              <ellipse id="Ellipse_18-14" cx="2" cy="2.5" class="cls-6" rx="2" ry="2.5"
                       transform="translate(15.25 5.211)"/>
              <ellipse id="Ellipse_19-14" cx="1" cy="1.5" class="cls-7" rx="1" ry="1.5"
                       transform="translate(.25 6.211)"/>
            </g>
          </g>
          <g id="Groupe_53" transform="rotate(-105.01 619.304 208.848)">
            <g id="Groupe_44-8">
              <ellipse id="Ellipse_14-15" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-15" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-15" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-15" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-15" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-15" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-8" transform="translate(401.75)">
              <ellipse id="Ellipse_14-16" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-16" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-16" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-16" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-16" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-16" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_54" transform="rotate(-120 562.221 233.55)">
            <g id="Groupe_44-9">
              <ellipse id="Ellipse_14-17" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-17" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-17" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-17" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-17" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-17" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-9" transform="translate(401.75)">
              <ellipse id="Ellipse_14-18" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-18" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-18" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-18" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-18" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-18" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_55" transform="rotate(-135 513.134 254.758)">
            <g id="Groupe_44-10">
              <ellipse id="Ellipse_14-19" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-19" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-19" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-19" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-19" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-19" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-10" transform="translate(401.75)">
              <ellipse id="Ellipse_14-20" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-20" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-20" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-20" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-20" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-20" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_56" transform="rotate(-150 469.124 273.772)">
            <g id="Groupe_44-11">
              <ellipse id="Ellipse_14-21" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-21" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-21" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-21" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-21" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-21" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-11" transform="translate(401.75)">
              <ellipse id="Ellipse_14-22" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-22" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-22" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-22" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-22" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-22" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
          <g id="Groupe_57" transform="rotate(-165.02 428.116 291.44)">
            <g id="Groupe_44-12">
              <ellipse id="Ellipse_14-23" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"/>
              <circle id="Ellipse_15-23" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(27.595 1.623)"/>
              <circle id="Ellipse_16-23" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(53.567 3.246)"/>
              <ellipse id="Ellipse_17-23" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(75.48 4.058)"/>
              <circle id="Ellipse_18-23" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(95.771 5.681)"/>
              <circle id="Ellipse_19-23" cx="1.217" cy="1.217" r="1.217" class="cls-7"
                      transform="translate(112.815 6.493)"/>
            </g>
            <g id="Groupe_45-12" transform="translate(401.75)">
              <ellipse id="Ellipse_14-24" cx="7.305" cy="7.71" class="cls-2" rx="7.305" ry="7.71"
                       transform="translate(100.64)"/>
              <circle id="Ellipse_15-24" cx="6.087" cy="6.087" r="6.087" class="cls-3"
                      transform="translate(75.48 1.623)"/>
              <circle id="Ellipse_16-24" cx="4.464" cy="4.464" r="4.464" class="cls-4"
                      transform="translate(52.755 3.246)"/>
              <ellipse id="Ellipse_17-24" cx="3.246" cy="3.652" class="cls-5" rx="3.246" ry="3.652"
                       transform="translate(33.276 4.058)"/>
              <circle id="Ellipse_18-24" cx="2.029" cy="2.029" r="2.029" class="cls-6"
                      transform="translate(15.421 5.681)"/>
              <circle id="Ellipse_19-24" cx="1.217" cy="1.217" r="1.217" class="cls-7" transform="translate(0 6.493)"/>
            </g>
          </g>
        </g>
      </svg>
      <div @click="emitToggleOnFlyBookingEvent" class="book">
        <p>{{ i18n("book-now") }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Utils from "../../mixins/Utils";
import SpinnerLoader from "../Animations/SpinnerLoader";

export default {
  name: "BookButton",
  mixins: [Utils],
  components: {
    "SpinnerLoader": SpinnerLoader
  },
  props: ['firstEventTime', 'options', 'clockFormat', 'nextEventIncoming', 'nextMeeting', 'checkInAction'],
  data() {
    return {
      requesting: false,
    };
  },
  created() {
    this.$parent.$on('popupCanceled', this.popupCanceled);
  },
  methods: {
    emitToggleOnFlyBookingEvent() {
      this.$emit('toggleOnFlyBooking');
    },
    checkIn() {
      this.requesting = true;
      if (this.options['authentication_check_in_out_required_action']) {
        this.authenticateCheckInOut();
      } else {
        axios.post(this.checkInAction, {
          'booking_id': this.nextMeeting.booking_id
        }).then(() => {
        }).catch(() => {
          this.requesting = false;
          this.$emit('displayPopup', {
            status: "error",
            title: this.i18n("popup-oops-title"),
            message: this.i18n("popup-oops-message"),
          });
        });
      }
    },
    authenticateCheckInOut() {
      this.$emit("displayPopup", {
        status: "booking-qrcode",
        title: this.i18n("booking"),
        message: this.i18n("scan-qrcode"),
        data: {
          type: "qrcode",
          url: "https://my.comeen.io/rooms/" + this.nextMeeting.booking_id,
        },
        duration: 30000
      });
    },
    popupCanceled() {
      this.requesting = false;
    }
  }
}
</script>

<style scoped>
.cls-2 {
  fill: #171f34;
  opacity: .501
}

.cls-3 {
  fill: #516cb4
}

.cls-4 {
  fill: #38c3ed
}

.cls-5 {
  fill: #27ffcd
}

.cls-6 {
  fill: #25e8b4
}

.cls-7 {
  fill: #25e874
}

.book-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  padding: 30px;
  height: 100%;
  width: 100%;
}

.incoming-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.incoming-text > p {
  margin: 20px 0 0;
  font-size: 3.5vw;
  font-weight: 600;
  text-align: center;
}

.book-button > p {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.book-button-wrapper {
  position: relative;
  height: inherit;
  width: 100%;
}

.dots {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  padding: 30px;
  width: 35vw;
}

.book-button .dots:nth-child(odd) {
  transform: rotate(82deg);
}

.book {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15vw;
  height: 15vw;
  border-radius: 50%;
  border: 1.5vw solid #161d31;
  background: #25e874;
}

.book > p {
  color: #171f34;
  text-align: center;
  font-size: 1.8vw;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: bold;
}


.pulse {
  animation-duration: 2s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  50% {
    opacity: 1;
    transform: scale(0.9);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

.check-in-button {
  display: flex;
  align-items: center;
  width: 65%;
  padding: 10px;
  border-radius: 5px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: bold;
  margin-top: 30px;
}

.check-in-button {
  border: 3px solid #26e689;
  color: #26e689;
}

.check-in-button > p {
  margin: 0 30px 0 15px;
}

.valid-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-left: auto;
  width: 50px;
  height: 50px;
}

.valid-container {
  background: rgba(38, 230, 137, 0.3);
}

.valid {
  position: absolute;
  top: 12px;
  left: 20px;
  display: inline-block;
  margin-right: 14px;
  transform: rotate(45deg);
  border-radius: 3px;
  height: 24px;
  width: 12px;
  border-bottom: 7px solid #25e874;
  border-right: 7px solid #25e874;
}

@media (orientation: portrait) {
  .book-button {
    flex-direction: row;
    width: 100%;
  }

  .book-button p {
    width: 100%;
  }
}
</style>
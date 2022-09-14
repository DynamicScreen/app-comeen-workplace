<template>
  <div class="appointments-container">
    <div class="appointments">
      <transition-group name="fade">
        <div class="appointment empty-appointment" v-if="!appointments.length" :key="0">
          <div class="empty-icon">
            <i class="fad fa-empty-set"></i>
          </div>
          <p>{{ i18n("no-meeting") }}</p>
        </div>
        <div class="appointment" v-else v-for="appointment in appointments" :key="appointment.id">
          <div class="schedule-wrapper">
            <p class="schedule">
              <i class="comeen-fa-small far fa-clock"></i>
              {{ getHoursMinutes(appointment.start_time, clockFormat) }} - {{ getHoursMinutes(appointment.end_time, clockFormat) }}
            </p>
          </div>
          <div v-if="!options['hide_meeting_name']" v-snip:css="2" class="event">{{ appointment.topic }}</div>
          <div v-else class="event">{{ i18n('booked') }}</div>
          <div v-if="!options['hide_organizer']" class="organizer comeen-secondary">{{ i18n("organized-by") }} {{ appointment.organizer }}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Utils from "../../mixins/Utils";

export default {
  name: "Appointments",
  mixins: [Utils],
  props: ['appointments', 'options', 'clockFormat'],
}
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: all .5s ease;
}
.fade-enter, .fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

.appointments-container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  overflow-y: auto;
}

.appointments {
  padding: 40px;
  min-height: 100%;
  flex-grow: 1;
}

.appointment {
  background: #0b101d;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 15px 21px;
  margin-bottom: 10px;
}

.schedule {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  margin: 0;
  border-radius: 5px;
  background: #171f34;
  font-weight: 200;
  font-size: 1.3rem;
}

.schedule > i {
  margin: 0 4px;
}

.event {
  margin: 10px 0 13px 0;
  font-weight: 600;
  font-size: 1.5rem;
}

.organizer {
  color: #888888;
}

.empty-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  padding: 10px;
  border-radius: 5px;
  background: #171f34;
}

.empty-icon > i {
  color: rgba(255, 255, 255, 0.5);
}

.empty-appointment {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.empty-appointment > p {
  margin-left: 20px;
  font-size: 1.2rem;
}

.comeen-fa-small {
  font-size: 1rem;
}

.comeen-secondary {
  font-size: 0.8rem;
}

@media (orientation: portrait) {

  .appointments > span {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .appointment {
    width: 100%;
  }

}

</style>
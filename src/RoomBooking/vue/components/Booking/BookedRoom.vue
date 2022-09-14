<template>
  <div class="booked-room">
    <div class="scroll">
      <div class="scrollBar" :style="{width: progressValue + '%'}"></div>
    </div>
    <div class="meeting-time">
      <p>{{ getHoursMinutes(appointment.start_time, clockFormat) }}</p>
      <p>{{ getHoursMinutes(appointment.end_time, clockFormat) }}</p>
    </div>

    <div class="details">
<!--      <div class="tags">-->
<!--        <div class="tag">-->
<!--          <span><i class="fad fa-paper-plane"></i> Réservation à la volée</span>-->
<!--        </div>-->
<!--        <div class="tag">-->
<!--          <span><i class="fad fa-sync-alt"></i> Synchro Comeen</span>-->
<!--        </div>-->
<!--      </div>-->
      <h1 v-if="!options['hide_meeting_name']" v-snip:css="2" class="title">{{ appointment.topic }}</h1>
      <h1 v-else class="title">{{ i18n("booked") }}</h1>
      <p v-if="appointment.topic === i18n('on-the-fly-meeting')" class="comeen-secondary">{{ i18n("booked-from-this-display") }}&nbsp;&nbsp;<i class="fad fa-paper-plane"></i></p>
      <p v-else-if="!options['hide_organizer'] && appointment.organizer" class="comeen-secondary">{{ i18n("organized-by") }} {{ appointment.organizer }}</p>

      <div v-if="!options['hide_company_logos'] && logos.length" class="compagny-container">
        <p class="comeen-secondary">{{ i18n("with") }}</p>
        <div class="company-logos">
          <div class="company-logo" v-for="logo in logos">
            <img v-bind:src="'https://logo.clearbit.com/' + logo" alt="">
            <span v-show="counts[logo] > 1" class="company-count">{{ counts[logo] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!options['disable_cancel_meeting_from_screen'] && !meetingRoomStatus" class="waiting-button">
      <p>{{ i18n("loading") }}</p>
      <div class="waiting-container">
        <SpinnerLoader />
      </div>
    </div>

    <div v-if="!options['disable_cancel_meeting_from_screen'] && meetingRoomStatus === 'booked'" class="check-in-button" @click="!requesting ? checkIn() : {}">
      <p>{{ i18n("check-in") }}</p>
      <div class="valid-container">
        <div v-if="!requesting" class="valid">
        </div>
        <SpinnerLoader v-else/>
      </div>
    </div>

    <div v-if="!options['disable_cancel_meeting_from_screen'] && meetingRoomStatus === 'checked_in'" class="check-out-button" @click="!requesting ? checkOut() : {}">
      <p>{{ i18n("check-out") }}</p>
      <div class="close-container">
        <div v-if="!requesting" class="close">
        </div>
        <SpinnerLoader v-else/>
      </div>
    </div>

    <div v-if="meetingRoomStatus === 'checked_out'" class="released-button">
      <p>{{ i18n("meeting-finished") }}</p>
      <div class="close-container">
        <SpinnerLoader />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {domains} from "../../../js/miscellaneous/domainsFilter";
import Utils from "../../mixins/Utils";
import axios from "axios";
import SpinnerLoader from "../Animations/SpinnerLoader";

export default {
  name: "BookedRoom",
  mixins: [Utils],
  components: {
    "SpinnerLoader": SpinnerLoader
  },
  props: ['meetingRoomId', 'image', 'appointment', 'options', 'clockFormat', 'checkInAction', 'checkOutAction', 'isOnTheFlyMeeting'],
  data() {
    return {
      logos: [],
      counts: [],
      requesting: false,
    };
  },
  mounted() {
    if (this.appointment.topic === this.i18n("on-the-fly-meeting") && this.meetingRoomStatus === "booked") {
      this.checkIn();
    }
    this.fillAttendees();
  },
  watch: {
    meetingRoomStatus(after, before) {
      this.requesting = false;
      if (!before && after === "booked" && this.appointment.topic === this.i18n("on-the-fly-meeting")) {
        this.checkIn();
      } else if (after === "checked_in") {
        this.$emit("displayPopup", {
          status: "success",
          title: this.i18n("checked-title"),
          message: this.i18n("checked-message"),
          duration: 3000
        });
      }
    }
  },
  computed: {
    progressValue() {
      let start = moment(this.appointment.start_time);
      let end = moment(this.appointment.end_time);
      let current = this.currentTime;

      return Math.round((current - start) / (end - start) * 100);
    },
    meetingRoomStatus() {
      return this.appointment.meeting_room_status;
    },
  },
  created() {
    this.$parent.$on('popupCanceled', this.popupCanceled);
  },
  methods: {
    fillAttendees() {
      let self = this;
      Object.values(this.appointment.attendees).forEach((attendee) => {
        let attendeeDomain = attendee.split('@').pop();
        if (!this.isUnWantedDomain(attendeeDomain)) {
          axios.get('https://logo.clearbit.com/' + attendeeDomain)
          .then(() => {
            this.counts[attendeeDomain] = (self.counts[attendeeDomain] || 0) + 1;
            this.logos.indexOf(attendeeDomain) === -1 ? this.logos.push(attendeeDomain) : null; // Add to array only if attendeeDomain isn't in
          })
          .catch(() => {})
        }
      })
    },
    isUnWantedDomain(domainToCheck) {
      if (this.appointment.organizer_email.split('@').pop() === domainToCheck) {
        return true;
      }

      return domains.some(domain => {
        return domainToCheck.includes(domain);
      });
    },
    checkIn() {
      this.requesting = true;
      if (this.options['authentication_check_in_out_required_action']) {
        this.authenticateCheckInOut("checkin");
      } else {
        axios.post(this.checkInAction, {
          'booking_id': this.appointment.booking_id
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
    checkOut() {
      this.requesting = true;
      if (this.options['authentication_check_in_out_required_action']) {
        this.authenticateCheckInOut("checkout");
      } else {
        axios.post(this.checkOutAction, {
          'booking_id': this.appointment.booking_id
        }).then(() => {
          this.$emit("releaseAppointment");
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
    authenticateCheckInOut(action) {
      this.$emit("displayPopup", {
        status: "booking-qrcode",
        title: this.i18n(action + "-qrcode-title"),
        message: this.i18n("scan-qrcode"),
        data: {
          type: "qrcode",
          url: "https://my.comeen.io/rooms/" + this.meetingRoomId + "?action=" + action,
        },
        duration: 30000
      });
    },
    popupCanceled() {
      this.requesting = false;
    }
  },
}
</script>

<style scoped>

.tags {
  display: flex;
}

.tag {
  border-radius: 15px;
  background: #364674;
  margin-right: 10px;
  font-size: 15px;
  padding: 3px 10px;
}

.tag > span > i {
  margin-right: 2px;
}

.booked-room {
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 70px 50px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.scroll {
  width: 100%;
  height: 15px;
  border-radius: 20px;
  background: #171f34;
  overflow: hidden;
}

.scrollBar {
  height: 100%;
  background: #fd5236;
  border-radius: 20px;
}

.meeting-time {
  display: flex;
  justify-content: space-between;
}

.meeting-time > p {
  margin: 10px 0;
  font-weight: bold;
  font-size: 1rem;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.details > .title {
  margin-left: 0;
  margin-bottom: 0;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  margin: 20px auto;
}

.compagny-container {
  width: 100%;
}

.company-logos {
  padding-right: 100px;
  padding-top: 10px;
  white-space: nowrap;
  width: 100%;
  margin: 10px 0;
  overflow-y: none;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.company-logo img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 5px;
  background: #181f33;
}

.company-logo {
  position: relative;
  display: inline-flex;
  justify-content: center;
  margin-right: 20px;
}

.company-count {
  position: absolute;
  right: -10px;
  top: -10px;
  background: #fd5236;
  border-radius: 50%;
  font-size: 0.8rem;
  width: 20px;
  height: 20px;
  text-align: center;
  padding: 2px;
}


/* Hide scrollbar for Chrome, Safari and Opera */
.company-logo::-webkit-scrollbar {
  display: none;
}

.check-in-button, .check-out-button, .waiting-button, .released-button {
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 65%;
  padding: 10px;
  border-radius: 5px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: bold;
}

.waiting-button, .released-button {
  border: 3px solid #e67e22;
  color: #e67e22;
}

.check-in-button {
  border: 3px solid #26e689;
  color: #26e689;
}

.check-out-button {
  border: 3px solid #fd5236;
  color: #fd5236;
}

.check-in-button > p, .check-out-button > p, .waiting-button > p, .released-button > p {
  margin: 0 30px 0 15px;
}

.valid-container, .close-container, .waiting-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-left: auto;
  padding: 10px;
}

.waiting-container {
  background: rgba(230, 126, 34, 0.3);
}

.valid-container {
  padding: 0;
  width: 50px;
  height: 50px;
  background: rgba(38, 230, 137, 0.3);
}

.close-container {
  background: rgba(253, 82, 54, 0.3);
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

.close {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 5px;
}

.close:before, .close:after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  content: ' ';
  width: 4px;
  height: 30px;
  border-radius: 10px;
  background: #fd5236;
}

.close:before {
  transform: rotate(45deg);
}

.close:after {
  transform: rotate(-45deg);
}

.comeen-secondary {
  font-size: 1rem;
}

@media (orientation: portrait) {
}

</style>
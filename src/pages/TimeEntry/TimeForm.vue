<template>
  <card class="card" title="Add time">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-4">
            <div class="form-group">
              <label>Project name</label>
              <select class="form-control" v-model="timeEntry.projectId">
                <option disabled value="">Please select a project</option>
                <option v-for="project in projects" v-bind:value="project.id" v-text="project.name"></option>
              </select>
            </div>
          </div>
          <div class="col-4">
            <div class="form-group">
              <label>Project name</label>
              <select class="form-control" v-model="timeEntry.requirementId">
                <option disabled value="">Please select a requirement</option>
                <option v-for="requirement in requirements" v-bind:value="requirement.id" v-text="requirement.name"></option>
              </select>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <label>Time begin</label>
              <!-- <input type="email" class="form-control" placeholder="Time begin" v-model="timeEntry.timeBegin" @blur="updateEndTime"> -->
              <input type="email" class="form-control" placeholder="Time begin" v-model="timeEntry.timeBegin">
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <label>Time end</label>
              <input type="email" class="form-control" placeholder="Time end" v-model="timeEntry.timeEnd" @blur="timeInDecimalHours">
            </div>
          </div>
        </div>
        <p>Total time: {{ this.timeEntry.time }}</p>
        <div class="form-group">
          <label>Description</label>
          <textarea class="form-control" placeholder="Here can be your description" v-model="timeEntry.description" rows="4"></textarea>
        </div>
        <p-button type="primary" round @click.native.prevent="addTime">Add time</p-button>
      </form>
    </div>
  </card>
</template>
<script>
class Project {
  constructor(id, name) {
    this.id = id+1;
    this.name = name;
  }
}
var projects = [];
['A', 'B', 'C'].forEach((name, index) => {
    projects.push(new Project(index, name));
});

var requirements = [];
['R1', 'R2', 'R3'].forEach((name, index) => {
    requirements.push(new Project(index, name));
});

export default {
  data() {
    return {
      timeEntry: {
        projectId: '',
        requirementId: '',
        timeBegin: '',
        timeEnd: '',
        description: '',
        time: 0,
      },
      projects,
      requirements,
    };
  },

  mounted() {
      let currentdate = new Date();
      this.timeEntry.timeBegin = ('0'+currentdate.getHours()).slice(-2)+('0'+currentdate.getMinutes()).slice(-2);
  },

  methods: {
    addTime() {
      console.log("Your data: " + JSON.stringify(this.timeEntry));
      axios.get('/time-entries', this.$timeEntry).then((data) => {
        console.log(data);
      },(error) => {
        console.log(error);
      });

      // update the begin date to End date on successful submission
    },

    timeInDecimalHours: function() {
      let timeBegin = this.timeEntry.timeBegin;
      let timeEnd = this.timeEntry.timeEnd;

      if(timeEnd.length == 0) {
        return;
      }

      if(timeBegin.length <= 3) {
        timeBegin = '0'+timeBegin;
      }

      if(timeEnd.length <= 3) {
        timeEnd = '0'+timeEnd;
      }

      // console.log(timeEnd, timeBegin);
      if(timeEnd.length >= 4 && timeEnd < timeBegin) {
        this.timeEntry.timeEnd = this.timeEntry.time = '';
        return;
      }

      let timeBeginHour = timeBegin.substring(0, 2);
      let timeBeginMinute = timeBegin.substring(2, 4);
      let timeEndHour = timeEnd.substring(0, 2);
      let timeEndMinute = timeEnd.substring(2, 4);
      let timeBeginUnix = Math.round(new Date("2006/01/02 "+timeBeginHour+':'+timeBeginMinute).getTime()/1000);
      let timeEndUnix = Math.round(new Date("2006/01/02 "+timeEndHour+':'+timeEndMinute).getTime()/1000);
      // console.log(timeBeginHour, timeBeginMinute,timeEndHour,  timeEndMinute, timeBeginUnix, timeEndUnix, (timeEndUnix - timeBeginUnix)/3600);

      this.timeEntry.time = ((timeEndUnix - timeBeginUnix)/3600).toFixed(2);
      // console.log(this.timeEntry.time);
      return this.timeEntry.time;

    }
  }
};
</script>
<style>
</style>

<template>
  <card class="card" title="Add time">
    <div>
      <form @submit.prevent @change="errors.clear($event.target.name)" @keydown="errors.clear($event.target.name)">
        <div class="row">
          <div class="col-4">
            <div class="form-group">
              <label>Project name</label>
              <select class="form-control" v-model="timeEntry.projectId" name="timeEntry.projectId" @change="getRequirements">
                <option disabled value="">Please select a project</option>
                <option v-for="project in projects" v-bind:value="project.id" v-text="project.name"></option>
              </select>
              <span class="help-block text-danger" v-if="errors.has('timeEntry.projectId')" v-text="errors.get('timeEntry.projectId')"></span>
            </div>
          </div>
          <div class="col-4">
            <div class="form-group">
              <label>Project name</label>
              <select class="form-control" v-model="timeEntry.requirementId" name="timeEntry.requirementId">
                <option disabled value="">Please select a requirement</option>
                <option v-for="requirement in requirements" v-bind:value="requirement.id" v-text="requirement.name"></option>
              </select>
              <span class="help-block text-danger" v-if="errors.has('timeEntry.requirementId')" v-text="errors.get('timeEntry.requirementId')"></span>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <label>Time begin</label>
              <input type="email" class="form-control" placeholder="Time begin" v-model="timeEntry.timeBegin" name="timeEntry.timeBegin">
              <span class="help-block text-danger" v-if="errors.has('timeEntry.timeBegin')" v-text="errors.get('timeEntry.timeBegin')"></span>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <label>Time end</label>
              <input type="email" class="form-control" placeholder="Time end" v-model="timeEntry.timeEnd" name="timeEntry.timeEnd" @blur="timeInDecimalHours">
              <span class="help-block text-danger" v-if="errors.has('timeEntry.timeEnd')" v-text="errors.get('timeEntry.timeEnd')"></span>
            </div>
          </div>
        </div>
        <p>Total time: {{ this.timeEntry.time }}</p>
        <div class="form-group">
          <label>Description</label>
          <textarea class="form-control" placeholder="Here can be your description" v-model="timeEntry.description" name="timeEntry.description" rows="4"></textarea>
          <span class="help-block text-danger" v-if="errors.has('timeEntry.description')" v-text="errors.get('timeEntry.description')"></span>
        </div>
        <p-button type="primary" round @click.native.prevent="addTime">Add time</p-button>
      </form>
    </div>
  </card>
</template>
<script>
class Errors {
  constructor() {
    this.errors = {};
  }

  get(field) {
    if(this.errors[field]) {
      return this.errors[field];
    }
  }

  record(errors) {
    this.errors = errors;
  }

  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  clear(field) {
    delete this.errors[field];
  }
}

class Form {
  constructor() {
    this.data =
  }

  reset() {

  }
}

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
      projects: [],
      requirements: [],
      errors: new Errors(),
    };
  },

  mounted() {
    this.setStartTime();
    this.getProjects();
  },

  methods: {
    setStartTime() {
      let currentdate = new Date();
      this.timeEntry.timeBegin = ('0'+currentdate.getHours()).slice(-2)+('0'+currentdate.getMinutes()).slice(-2);
    },

    getProjects() {
      axios.get('projects')
        .then((response) => {
          let data = response.data;
          if(data.status) {
            this.projects = data.projects;
          }
        },(error) => {
          this.projects = [];
          this.$notify({
            message: 'Oops! There was something wrong in fetching the projects',
            type: 'danger'
          })
        });
    },

    getRequirements() {
      this.timeEntry.requirementId = '';
      axios.get('requirements', {
          params: {
            project_id: this.timeEntry.projectId
          }
        })
        .then((response) => {
          let data = response.data;
          if(data.status) {
            this.requirements = data.requirements;
          }
        },(error) => {
          this.$notify({
            message: 'Oops! There was something wrong in fetching the requirements',
            type: 'danger'
          })
          this.requirements = [];
        });

    },

    addTime() {
      // console.log("Your data: " + JSON.stringify(this.timeEntry));
      axios.post('time-entries', this.timeEntry)
        .then((data) => {
          console.log(data);
      // update the begin date to End date on successful submission
      // setup notification
      // list todays task in bottom
        },(error) => this.errors.record(error.response.data));

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

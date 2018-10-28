<template>
  <card class="card" title="Add time">
    <div>
      <form @submit.prevent @change="form.errors.clear($event.target.name)" @keydown="form.errors.clear($event.target.name)">
        <div class="row">
          <div class="col-4">
            <div class="form-group">
              <label>Project name</label>
              <select class="form-control" v-model="form.projectId" name="projectId" @change="getRequirements">
                <option disabled value="">Please select a project</option>
                <option v-for="project in projects" v-bind:value="project.id" v-text="project.name"></option>
              </select>
              <span class="help-block text-danger" v-if="form.errors.has('projectId')" v-text="form.errors.get('projectId')"></span>
            </div>
          </div>
          <div class="col-4">
            <div class="form-group">
              <label>Project name</label>
              <select class="form-control" v-model="form.requirementId" name="requirementId">
                <option disabled value="">Please select a requirement</option>
                <option v-for="requirement in requirements" v-bind:value="requirement.id" v-text="requirement.name"></option>
              </select>
              <span class="help-block text-danger" v-if="form.errors.has('requirementId')" v-text="form.errors.get('requirementId')"></span>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <label>Time begin</label>
              <input type="email" class="form-control" placeholder="Time begin" v-model="form.timeBegin" name="timeBegin">
              <span class="help-block text-danger" v-if="form.errors.has('timeBegin')" v-text="form.errors.get('timeBegin')"></span>
            </div>
          </div>
          <div class="col-2">
            <div class="form-group">
              <label>Time end</label>
              <input type="email" class="form-control" placeholder="Time end" v-model="form.timeEnd" name="timeEnd" @blur="timeInDecimalHours">
              <span class="help-block text-danger" v-if="form.errors.has('timeEnd')" v-text="form.errors.get('timeEnd')"></span>
            </div>
          </div>
        </div>
        <p>Total time: {{ this.form.time }}</p>
        <div class="form-group">
          <label>Description</label>
          <textarea class="form-control" placeholder="Here can be your description" v-model="form.description" name="description" rows="4"></textarea>
          <span class="help-block text-danger" v-if="form.errors.has('description')" v-text="form.errors.get('description')"></span>
        </div>
        <p-button type="primary" round @click.native.prevent="addTime">Add time</p-button>
      </form>
    </div>
  </card>
</template>
<script>
import Form from '../../classes/Form.js'

export default {
  data() {
    return {
      form: new Form({
        projectId: '',
        requirementId: '',
        timeBegin: '',
        timeEnd: '',
        description: '',
        time: 0,
      }),
      projects: [],
      requirements: [],
    };
  },

  mounted() {
    this.setStartTime();
    this.getProjects();
  },

  methods: {
    setStartTime() {
      let currentdate = new Date();
      this.form.timeBegin = ('0'+currentdate.getHours()).slice(-2)+('0'+currentdate.getMinutes()).slice(-2);
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
      this.form.requirementId = '';
      axios.get('requirements', {
          params: {
            project_id: this.form.projectId
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
          });
          this.requirements = [];
        });

    },

    addTime() {
      let timeEnd = this.form.timeEnd;
      this.form.submit('post', 'time-entries')
        .then(data => {
          this.$notify({
            message: data.message,
            type: 'success'
          });
          this.form.timeBegin = timeEnd;
        })
        .catch(errors => {
          if(this.form.errors == {}) {
            this.$notify({
              message: 'Oops! There was something wrong in saving the time entry',
              type: 'danger'
            });
          }
        });
        // list todays task in bottom
    },

    timeInDecimalHours: function() {
      let timeBegin = this.form.timeBegin;
      let timeEnd = this.form.timeEnd;

      if(timeEnd.length == 0) {
        return;
      }

      if(timeBegin.length <= 3) {
        timeBegin = '0'+timeBegin;
      }

      if(timeEnd.length <= 3) {
        timeEnd = '0'+timeEnd;
      }

      if(timeEnd.length >= 4 && timeEnd < timeBegin) {
        this.form.timeEnd = this.form.time = '';
        return;
      }

      let timeBeginHour = timeBegin.substring(0, 2);
      let timeBeginMinute = timeBegin.substring(2, 4);
      let timeEndHour = timeEnd.substring(0, 2);
      let timeEndMinute = timeEnd.substring(2, 4);
      let timeBeginUnix = Math.round(new Date("2006/01/02 "+timeBeginHour+':'+timeBeginMinute).getTime()/1000);
      let timeEndUnix = Math.round(new Date("2006/01/02 "+timeEndHour+':'+timeEndMinute).getTime()/1000);

      if(isNaN(timeBeginUnix)) {
        this.form.timeBegin = this.form.time = '';
        return;
      }
      if(isNaN(timeEndUnix)) {
        this.form.timeEnd = this.form.time = '';
        return;
      }

      this.form.time = ((timeEndUnix - timeBeginUnix)/3600).toFixed(2);
      return this.form.time;
    }
  }
};
</script>
<style>
</style>

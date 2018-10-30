<template>
  <card class="card time_entries_card" title="Time entries">
    <div class="table-responsive">
      <table class="table table-striped table-condensed">
        <thead>
          <tr>
            <th>#</th>
            <th class="date">Date</th>
            <th>Project</th>
            <th>Requirement</th>
            <th class="description">Description</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(timeEntry, key) in timeEntries">
            <th scope="row" v-text="key+1"></th>
            <td v-text="timeEntry.created_at"></td>
            <td v-text="timeEntry.project_name"></td>
            <td v-text="timeEntry.requirement_name"></td>
            <td v-html="timeEntry.description"></td>
            <td v-text="timeEntry.time"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </card>
</template>
<script>
export default {
  data() {
    return {
      timeEntries: [],
    }
  },

  mounted() {
    this.getTimeEntries();
  },

  methods: {
    getTimeEntries() {
      axios.get('time-entries')
        .then((response) => {
          let data = response.data;
          if(data.status) {
            this.timeEntries = data.timeEntries;
          }
        },(error) => {
          this.timeEntries = [];
          this.$notify({
            message: 'Oops! There was something wrong in fetching the time entries.',
            type: 'danger'
          })
        });
    },
  }
};
</script>

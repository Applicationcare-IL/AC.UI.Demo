<template>
  <TabView>
    <TabPanel header="נתונים נוספים">
      <div class="flex flex-column gap-5 m-5">
        <div class="flex flex-auto gap-5 flex-row">
          <WMInput
            name="created_by"
            type="info"
            :highlighted="true"
            :label="$t('created_by') + ':'"
            value="Israel Israeli"
            inline
          />
          <WMInput
            name="modified_by"
            type="info"
            :highlighted="true"
            :label="$t('modified_by') + ':'"
            value="שרוליק כהן"
            inline
          />
        </div>
        <div class="flex flex-auto gap-5 flex-row">
          <WMInput
            name="created_at"
            type="info"
            :highlighted="true"
            :label="$t('created_at') + ':'"
            value="12:38  11/11/22"
            inline
          />
          <WMInput
            name="modified_at"
            type="info"
            :highlighted="true"
            :label="$t('modified_at') + ':'"
            value="12:38  11/11/22"
            inline
          />
        </div>
      </div>
    </TabPanel>
    <!-- <TabPanel header="טאב 1">
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
        numquam eius modi.
      </p>
    </TabPanel>
    <TabPanel header="טאב 2">
      <p>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi, id est
        laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
        distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
        cumque nihil impedit quo minus.
      </p>
    </TabPanel> -->
  </TabView>
</template>

<script setup></script>

<style scoped lang="scss"></style>

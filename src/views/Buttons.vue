<template>
    <div class="container">
        <div class="my-4 bg-white p-2 rounded grid">
      <!-- <h3 class="col-span-2">Buttons</h3> -->

     
        <WMButton class="m-1 col-6" name="location" icon="location">צפיה במפה</WMButton>
        <WMButton class="m-1 col-6" name="location" icon="location" disabled>צפיה במפה</WMButton>
     
        <WMButton class="m-1 col-6" name="customer" icon="customer">הוספת לקוח</WMButton>
        <WMButton class="m-1 col-6" name="customer" icon="customer"  disabled>הוספת לקוח</WMButton>
     
        <WMButton class="m-1 col-6" name="attach" icon="attach" >הוספת קובץ</WMButton>
        <WMButton class="m-1 col-6" name="attach" icon="attach" disabled>הוספת קובץ</WMButton>
     
        <WMButton class="m-1 col-6" name="export" icon="export">ייצוא נתונים</WMButton>
        <WMButton class="m-1 col-6" name="export" icon="export"  :disabled="true">ייצוא נתונים</WMButton>
     
        <WMButton class="m-1 col-6" name="export-white" icon="export">ייצוא נתונים</WMButton>
        <WMButton class="m-1 col-6" name="export-white" icon="export"  :disabled="true">ייצוא נתונים</WMButton>
      
        <WMButton class="m-1 col-6" name="mail" icon="mail">דוא”ל</WMButton>
        <WMButton class="m-1 col-6" name="mail" icon="mail"  :disabled="true">דוא”ל</WMButton>
     
        <WMButton class="m-1 col-6" name="mail-white" icon="mail">דוא”ל</WMButton>
        <WMButton class="m-1 col-6" name="mail-white" icon="mail"  :disabled="true">דוא”ל</WMButton>

        <WMButton class="m-1 col-6" name="phone" icon="phone">שיחה</WMButton>
        <WMButton class="m-1 col-6" name="phone" icon="phone"  :disabled="true">שיחה</WMButton>
     
        <WMButton class="m-1 col-6" name="phone-white" icon="phone">שיחה</WMButton>
        <WMButton class="m-1 col-6" name="phone-white" icon="phone"  :disabled="true">שיחה</WMButton>

        <WMButton class="m-1 col-6" name="done" icon="done">טופל</WMButton>
        <WMButton class="m-1 col-6" name="done" icon="done"  :disabled="true">טופל</WMButton>
     
        <WMButton class="m-1 col-6" name="done-white" icon="done">טופל</WMButton>
        <WMButton class="m-1 col-6" name="done-white" icon="done"  :disabled="true">טופל</WMButton>

        <WMButton class="m-1 col-6" name="assign" icon="assign">הקצה</WMButton>
        <WMButton class="m-1 col-6" name="assign" icon="assign"  :disabled="true">הקצה</WMButton>
     
        <WMButton class="m-1 col-6" name="assign-white" icon="assign">הקצה</WMButton>
        <WMButton class="m-1 col-6" name="assign-white" icon="assign"  :disabled="true">הקצה</WMButton>

        <WMButton class="m-1 col-6" name="cancel" icon="cancel" iconPosition="right">ביטול</WMButton>
        <WMButton class="m-1 col-6" name="cancel" icon="cancel"  :disabled="true" iconPosition="right">ביטול</WMButton>

        <WMButton class="m-1 col-6" name="new" icon="new" >חדש</WMButton>
        <WMButton class="m-1 col-6" name="new" icon="new"  :disabled="true" >חדש</WMButton>

        <WMButton class="m-1 col-6 small" name="new" icon="new" >חדש</WMButton>
        <WMButton class="m-1 col-6 small" name="new" icon="new"  :disabled="true" >חדש</WMButton>

        <WMButton class="m-1 col-6" name="save" icon="save" type="specialSave" iconPosition="right">שמירה</WMButton>
        <WMButton class="m-1 col-6" name="save" icon="save"  :disabled="true" type="specialSave" iconPosition="right">שמירה</WMButton>

        <WMButton class="m-1 col-6" name="unlink" icon="unlink"  iconPosition="right"></WMButton>
        <WMButton class="m-1 col-6" name="unlink" icon="unlink"  :disabled="true"  iconPosition="right"></WMButton>

        <WMButton class="m-1 col-6" name="edit" icon="edit"  iconPosition="right"></WMButton>
        <WMButton class="m-1 col-6" name="edit" icon="edit"  :disabled="true"  iconPosition="right"></WMButton>
        
        <WMButton class="m-1 col-6" name="save-table" icon="save"  iconPosition="right"></WMButton>
        <WMButton class="m-1 col-6" name="save-table" icon="save"  :disabled="true"  iconPosition="right"></WMButton>

        <!-- <WMButton class="m-1 col-6" name="sort" icon="sort"  iconPosition="right">ישן קודם</WMButton> -->
        <WMButtonSort ></WMButtonSort>
        <WMButtonSort disabled></WMButtonSort>

        <WMButton class="m-1 col-6 " name="basic-primary" iconPosition="right">כפתור </WMButton>
        <WMButton class="m-1 col-6 " name="basic-primary" :disabled="true"  iconPosition="right">כפתור </WMButton>
        <WMButton class="m-1 col-6 small" name="basic-primary" iconPosition="right">כפתור </WMButton>
        <WMButton class="m-1 col-6 small" name="basic-primary" :disabled="true"  iconPosition="right">כפתור </WMButton>
        <WMButton class="m-1 col-6 " name="basic-secondary" iconPosition="right">כפתור </WMButton>
        <WMButton class="m-1 col-6 " name="basic-secondary" :disabled="true"  iconPosition="right">כפתור </WMButton>
        <WMButton class="m-1 col-6 small" name="basic-secondary" iconPosition="right">כפתור </WMButton>
        <WMButton class="m-1 col-6 small" name="basic-secondary" :disabled="true"  iconPosition="right">כפתור </WMButton>
      
    </div> 
    </div>
</template>
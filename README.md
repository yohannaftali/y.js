# Y Framework

Javascript framework for creating applications
Tested with codeigniter 3 PHP framework

## Getting Started
Put these files into /js/framework folder (see directory structure)


Include script on html head
example: 

``` javascript
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.lang.id.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.material.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.web.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.app.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.loader.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.panel.js"  ></script>
<script type="text/javascript" language="javascript" charset="UTF-8"  src="js/framework/y.form.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.dashboard.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.converter.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/v.sidebar.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/v.print.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.autocomplete.js"></script>
<script type="text/javascript" language="javascript" charset="UTF-8" src="js/framework/y.ready.js"></script>

```

### Prerequisites

Include these libraries:

- materialize.js
- jquery
- chart.js
- cleave.js
- moment.js
- floatthead
- materialize-perfect-scrollbar.jquery

### Deployment

Put this scipt at near the end of html before </html> 

``` javascript

<script>
 jQuery(document).ready(function() {
  Main.init();
	});
</script>

```

## Directory and File Structure

```
project
│   index.php
|
└───application
│   │   index.html
│   │
│   |___views
│   |   |   v_login.php
│   |   |   v_home.php
│   |   |   ...
│   |
│   └───controllers
│   |   │   C_login.php
│   |   │   C_home.php
│   |   │   C_your_module.php
│   |   │   ...
│   |
│   |___models
|   |   |    M_ap.php
|   |   |    M_ap_config.php
|   |   |    M_ap_csv.php
|   |   |    M_ap_module.php
|   |   |    M_ap_user.php
|   |   |    M_database.php
|   |   |    M_gate.php
|   |   |    M_home.php
|   |   |    M_login.php
|   |   |    M_your_module.php
|   |   |    ...
|   |
|   |___...
|
└───css
|
└───fonts
|
└───images
|
└───intdoc
|
└───system
|
└───js
    │   index.php
    │
    |___dashboard
    |
    |___chart.js
    |
    |___cleave.js
    |
    |___framework
    |
    |___jquery
    |
    |___materialize
    |
    |___modules
    |   |   your_module.js
    |   |   ...
    |
    |___moment.js
    |
    |___vendor

```

## Module


## Panel


## Form

### param

Define options for form framework

``` javascript
const param = {
    module: 'my_module_name',
    type: stringType,
    label: stringLabel
}
```

| key    | type   | default | description            | options                                                                                                                                                  |
| ------ | ------ | ------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| module | string | null    | name of your module    |                                                                                                                                                          |
| type   | string | null    | type of your form      | 'm' = form with 1 section for master<br> 'md' = form with 2 section for master and detail<br> 'mdh' = form with 3 section for master, detail and history |
| label  | string | null    | label for your section | title                                                                                                                                                    |


# BASIC FORM

## Create New module 
Create new module from Menu > Settings > Master Modules > New

## Create Javascript
module name: module_name, replace with your module name
create file in \js\module\v_module_name.js

```javascript
const param = {
    module: 'module_name',
    type: 'mdh',
    label: {
        master: 'title master section',
        detail: 'title detail section',
        history: 'title of history section'
    }
}
```

## Create Controller


## Create Model


# SELECT
## Static Select
example create field_name with select in table_name 

### Define select
Define select: true in field
file: \js\modules\v_module_name.js

```javascript
this.field.table_name = [
    ...
    { name: field_name, label: 'Field Name', select: true }
    ...
]
```

### Create Controller 
Create function inside class controller with name call_field_name_select
file: \application\controllers\C_module_name.php

```php
class C_module_name extends C_secure_area
{
    ...
    public function call_field_name_select()
    {
        $this->M_gate->req_json($this->model, 'get_field_name_select', $_GET);
    }
    ...
}
```

### Create Model
Create function inside class model with name get_field_name_select
file: \application\models\M_module_name.php

```php
class M_module_name extends CI_Model
{
    ...
    public function get_field_name_select()
    {
        $result = array();
        $this->db->select('field_name as data, field_id as value');
        $this->db->from('tb_table');
        $query = $this->db->get();
        if ($query && ($query->num_rows() > 0)) {
            $query_array = $query->result_array();
            foreach ($query_array as $item) {
                array_push($result, $item);
            }
        }
        return $result;
    }
    ...
}
```

## Dynamic Content Select

### ForceRewrite
add force reWrite when calling initSelect on Event where content of select already changed

```javascript
const tableName = 'table_name'
const callbackAfterWriteSelect = () => {}
const callbackAfterInitSelect = () => {}
const forceRewrite = true
this.panel.initSelect(tableName, callbackAfterWriteSelect , callbackAfterInitSelect, forceRewrite)
```

### Single field with extra parameter
call these function on event where content of select is changed

```javascript
const tableName = 'table_name'
const fieldName = 'field_name'
const callbackAfterWriteSelect = () => {}
const callbackAfterInitSelect = () => {}
const forceRewrite = true
this.panel.selectController[tableName][fieldName] = this.queryUrl + 'call_' + fieldName + '_select?id=' + id
this.panel.initSelect(tableName, callbackAfterWriteSelect , callbackAfterInitSelect, forceRewrite)
```

add function inside class model with name get_field_name_select, dont't forget to pass $_GET in controller
file: \application\models\M_module_name.php

```php
class M_module_name extends CI_Model
{
    ...
    public function get_field_name_select($get)
    {
        $param = isset($get['id']) ? $get['id'] : false;
        $result = array();
        $this->db->select('field_name as data, field_id as value');
        $this->db->from('tb_table');
        if($id){
            $this->db->where('id', $id);
        }
        $query = $this->db->get();
        if ($query && ($query->num_rows() > 0)) {
            $query_array = $query->result_array();
            foreach ($query_array as $item) {
                array_push($result, $item);
            }
        }
        return $result;
    }
    ...
}
```

### Multiple field with extra parameter
call these function on event where content of select is changed

```javascript
const tableName = 'table_name'
const fieldName1 = 'field_name1'
const fieldName2 = 'field_name2'
...
const fieldNameN = 'field_nameN'
const callbackAfterWriteSelect = () => {}
const callbackAfterInitSelect = () => {}
const forceRewrite = true
this.panel.selectController[tableName][fieldName1] = this.queryUrl + 'call_' + fieldName1 + '_select?id=' + id
this.panel.selectController[tableName][fieldName2] = this.queryUrl + 'call_' + fieldName2 + '_select?id=' + id
...
this.panel.selectController[tableName][fieldNameN] = this.queryUrl + 'call_' + fieldNameN + '_select?id=' + id
this.panel.initSelect(tableName, callbackAfterWriteSelect , callbackAfterInitSelect, forceRewrite)
```

## Dashboard





## Authors

* **Yohan Naftali** - *Initial work* - [YFramework](https://github.com/YFramework)

See also the list of [contributors](https://github.com/YFramework/contributors) who participated in this project.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


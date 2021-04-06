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

<details>

<summary>Show details</summary>
  
<p>
	
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

</p>

</details>

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

## 1. Create New module 
Create new module from Menu > Settings > Master Modules > New
Write id module and put it in controller folder

## 2. Create Javascript
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

## 3. Create Controller
```php
<?php
if (!defined('BASEPATH')) {header('Location: https://' . $_SERVER['HTTP_HOST'] . '/error.php'); die();};
require_once "C_secure_area.php";
class C_module_name C_secure_area
{
    private $model = 'M_module_name';
  
    public function __construct()
    {
        parent::__construct('put_your_module_id_here');
        $module = 'module_name';
        $model = 'M_'.$module;
        $this->load->model($model);
        $this->model = $model;
        $this->data = array('module' => $module);
    }

    public function index()
    {
        parent::send_module($this->data);
    }

    // Detail
    public function get_detail()
    {
        $this->M_gate->req_json($this->model, 'get_detail', $_GET);
    }

    // Master
    public function get()
    {
        $this->M_gate->req_json($this->model, 'get_data', $_GET);
    }

    // Submit
    public function submit()
    {
        $this->M_gate->req_json($this->model, 'submit', $_POST);
    }
}

/*
// END C_module_name
/* End of file C_module_name.php */
/* Location: ./application/controllers/C_module_name.php */
```

## 4. Create Model
```php
<?php
if (!defined('BASEPATH')) {header('Location: https://' . $_SERVER['HTTP_HOST'] . '/error.php');die();}
;
class M_module_name extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }
    
    public function get_data($data)
    {
        $result = array();
        $id = isset($data['id']) ? $data['id'] : '';
        if ($id != '') {
            $result['master'] = $this->get_master($id);
        } else {
            $result['error'] = 'Get data not Found';

        }
        return $result;
    }
    
    private function get_master($id)
    {
        $result = array();
        ...
        return $result;
    }
    
    public function submit($post)
    {
        $result = array();
        ...
        return $result;
    }
    
    public function get_detail($param)
    {
        $result = array();
        $filter = false;
	...
	$unfilter_db = clone $db;
        if (!$filter) {
            $db->limit(100);
            $filter = true;
        }

        $query = $db->get();
        if ($query && ($query->num_rows() > 0)) {
            $count = $unfilter_db->get()->num_rows();
            $result = $query->result_array();
            if ($count > $query->num_rows()) {
                $result[0]['db_num_rows'] = $count;
            }
        }
        return $result;
    }
    
 }
    
    
```

# SELECT
## Static Select
example create field_name with select in table_name 

### Javascript Module
Define select: true in field
file location: \js\modules\v_module_name.js

```javascript
this.field.table_name = [
    ...
    { name: field_name, label: 'Field Name', select: true }
    ...
]
```

### Controller
Create function inside class controller with name call_field_name_select
file location: \application\controllers\C_module_name.php

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

### Model
Create function inside class model with name get_field_name_select
file location: \application\models\M_module_name.php

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



## Implement CreateButtonModule
### js on sender/initiator module
```javascript
form.prototype.listenerButtonModule = function () {
	let orderId = false
	let senderId = false
	this.createButtonModule({
		title: 'Other Module',
		module: 'other_module_name',
		callbackBefore: () => {
			// function to run before new module loaded
			senderId = this.id
		},
		callback: (obj) => {
			// function to run when module form loaded
			obj.senderId = senderId
		},
		callbackAfter: () => {
			// function to run after module form and data has finish loaded
			console.log('finished')
		}
	})
}
```

### js on receiver/target module
example implementation on init function with md type
```javascript
form.prototype.init = function () {
	this.superinit()
	this.resetMaster()
	this.handleAction()
	this.hideTitleDocument()
	if(typeof this.startMasterMode !== 'undefined' && this.startMasterMode){
	    const senderId = typeof this.senderId !== 'undefined' ? this.senderId : false
	    this.showMaster()
	    $('#input_' + this.mainField).val(senderId)
	    this.listenerButtonModuleBack()
	    this.showData(true, false, true, 
		() => {
		    this.masterMode()
		    this.showToolbar()
		},
		() => {
		    document.getElementById('btn-toolbar-module-previous_module_name').style.display = 'block'
		}
	    )
	}
	else{
	    this.writeDetail()
	    this.detailMode()
	    this.hideToolbar()
	}
}
```
```javascript
form.prototype.listenerButtonModuleBack = function(){
let senderId = false
	this.createButtonModule({
		title: 'Back to Previous Module',
    		module: 'previous_module_name',
    		callbackBefore: () => {
			senderId = typeof this.senderId !== 'undefined' ? this.senderId : false
		},
		callback: (obj) => {
			obj.startMasterMode = true,
			obj.senderId = senderId
		},
		callbackAfter: () => 
		}
	})
}
```
## Authors

* **Yohan Naftali** - *Initial work* - [YFramework](https://github.com/YFramework)

See also the list of [contributors](https://github.com/YFramework/contributors) who participated in this project.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


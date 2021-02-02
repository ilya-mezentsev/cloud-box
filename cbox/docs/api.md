## Box API

### Errors
Each API response can contains error in format:
```json5
{
  "status": "error",
  "description": "Some error description"
}
```

### GET /disks - return list of available disks
#### Response:
```json5
{
  "status": "ok",
  "data": {
    "disks": ["disk_name_1", "disk_name_2"]
  }
}
```

### GET /file?file_path=:file_path&disk_name=:disk_name - request file from disk
#### Parameters:
* \:file_path - path to file on disk
* \:disk_name - name of disk
#### Response - file for downloading

### POST /file - create a file on disk
#### Parameters:
* disk_name - name of disk
* folder_path - folder where file should be created
* file - file data
#### Response:
```json5
{
  "status": "ok"
}
```

### PATCH /file - rename file
#### Body:
```json5
{
  "disk_name": "disk_name_1",
  "folder_path": "foo/bar/baz",
  "old_name": "old.png",
  "new_name": "new.png"
}
```
#### Response:
```json5
{
  "status": "ok"
}
```

### DELETE /file?file_path=:file_path&disk_name=:disk_name - delete file
#### Parameters:
* \:file_path - path to file on disk
* \:disk_name - name of disk
#### Response:
```json5
{
  "status": "ok"
}
```

### GET /folder?folder_path=:folder_path&disk_name=:disk_name - get content of folder
#### Parameters:
* \:folder_path - path to folder on disk
* \:disk_name - name of disk
#### Response:
```json5
{
  "status": "ok",
  "data": {
    "path": "foo/bar",
    "nodes": [
      {"node_type":  "file", "name":  "name.txt"},
      {"node_type":  "folder", "name":  "baz"},
      {"node_type":  "file", "name":  "xyz.png"},
    ]
  }
}
```

### POST /folder - create folder
#### Body:
```json5
{
  "disk_name": "disk_name_2",
  "root_path": "foo",
  "folder_name": "bar"
}
```
#### Response:
```json5
{
  "status": "ok"
}
```

### PATCH /folder - rename folder
#### Body:
```json5
{
  "disk_name": "disk_name_1",
  "folder_path": "foo/bar",
  "old_name": "baz",
  "new_name": "xyz"
}
```
#### Response:
```json5
{
  "status": "ok"
}
```

### DELETE /folder?folder_path=:folder_path&disk_name=:disk_name - delete folder
#### Parameters:
* \:folder_path - path to folder on disk
* \:disk_name - name of disk
#### Response:
```json5
{
  "status": "ok"
}
```

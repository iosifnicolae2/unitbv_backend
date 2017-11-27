#!/bin/bash

echo -n "Enter the issue number [ENTER]: "
read nr
hub pull-request -i ${nr}

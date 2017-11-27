#!/bin/bash

echo -n "Enter the branch name: "
read name
git checkout -b ${name}

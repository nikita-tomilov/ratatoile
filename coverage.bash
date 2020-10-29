#!/bin/bash
mvn test jacoco:report
xdg-open server/target/site/jacoco/index.html &

now=$(date +"%Y%m%d%H%M%S")
pg_dump -U root uhhub > ${now}_uhhub.sql
aws s3 cp ${now}_uhhub.sql s3://unitedhardscapes-backups/db/
rm ${now}_uhhub.sql

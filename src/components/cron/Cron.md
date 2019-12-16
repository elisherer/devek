# Diagram

```
    * * * * * *
    | | | | | | 
    | | | | | +-- Year              (range: 1900-3000)
    | | | | +---- Day of the Week   (range: 0-7, SUN-SUN)
    | | | +------ Month of the Year (range: 1-12)
    | | +-------- Day of the Month  (range: 1-31)
    | +---------- Hour              (range: 0-23)
    +------------ Minute            (range: 0-59)
```

# Seconds / Minutes / Hours / Months / Years

https://www.freeformatter.com/cron-expression-generator-quartz.html#cronexpressionexamples
https://en.wikipedia.org/wiki/Cron
http://man7.org/linux/man-pages/man5/crontab.5.html
https://github.com/harrisiirak/cron-parser/blob/master/lib/expression.js
http://www.nncron.ru/help/EN/working/cron-format.htm
https://stackoverflow.com/questions/14203122/create-a-regular-expression-for-cron-statement


*       - Every second
N/M     - Every M second(s) starting at second N 
          When N=0       then it can be replaced with */M
          When N=0 & M=1 then it can be replaced with *
N,M,... - Specific second(s) (Months use JAN.FEB,...)
N-M     - Every second between second N and second M

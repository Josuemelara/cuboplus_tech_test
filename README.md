### CUBO+ Technical test
[video] https://drive.google.com/file/d/1iPQaz6Adru6i22JdiWKmYOsOH-uza_Wp/view?usp=drive_link
[solution] https://github.com/Josuemelara/cuboplus_tech_test/

## El método calculateBalances tiene como primer parametro la dirección por buscar y el tipo de balance por mostrar de acuerdo a los siguientes casos
##  - 1 for the mempool balance in bitcoin
##  - 2 for the mempool balance in SATs
##  - 3 for the balance on chain in bitcoin
##  - 4 for the balance on chain in SATs

## El método calculateBalanceVariation recibe la dirección y los días en los cuáles se necesita saber la variación de fondos
## Ejemplo: calculateBalanceVariation("address",30) mostraría la variación en 30 días
## Por defecto al ejectutar el programa se mostrarán el balance On chain y en el mempool en Bitcoin así como la variación de fondos en 7 y 30 días.
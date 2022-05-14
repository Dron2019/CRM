<?php

    $fp = fopen('./agendas.json', 'w');
    fwrite($fp, $_POST['data']);
    fclose($fp);
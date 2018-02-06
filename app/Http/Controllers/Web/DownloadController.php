<?php

namespace Vanguard\Http\Controllers\Web;

use Dompdf\Dompdf;
use Maatwebsite\Excel\Facades\Excel;
use Vanguard\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Vanguard\Services\TableService;

class DownloadController extends Controller
{
    private $tableService;

    public function __construct(TableService $ts) {
        $this->tableService = $ts;
    }

    public function download(Request $request) {
        $data = "";
        switch ($request->filename) {
            case 'CSV': $dwn_mode = "csv";
                $data = $this->downloader_csv($request);
                break;
            case 'XLS': $dwn_mode = "xlsx";
                $data = $this->downloader_xlsx($request, "data_export_" . date("Y-m-d") . "." . $dwn_mode);
                break;
            case 'PDF': $dwn_mode = "pdf";
                $data = $this->downloader_pdf($request);
                break;
            default: $dwn_mode = "";
                break;
        }

        if (empty($dwn_mode)) {
            return "<h1>Incorrect request</h1>";
        }

        // force download
        header("Content-Type: application/force-download");

        header("Content-Disposition: attachment;filename=data_export_" . date("Y-m-d") . "." . $dwn_mode);
        header("Content-Transfer-Encoding: binary");

        echo $data;
        exit;
    }

    /*
     * Create data flow for csv file
     */
    private function downloader_csv($post) {
        $respArray = $this->tableService->getData($post);

        ob_start();
        $out = fopen("php://output", "w");
        $titles = array();
        foreach ($respArray['data'][0] as $key => $val) {
            if (($respArray['key_settings'][$key])->name) {
                $titles[] = ($respArray['key_settings'][$key])->name;
            } else {
                $titles[] = $key;
            }
        }
        fputcsv($out, $titles);
        foreach ($respArray['data'] as $row) {
            fputcsv($out, (array)$row);
        }
        fclose($out);
        return ob_get_clean();
    }

    /*
     * Create data flow for xlsx file
     */
    private function downloader_xlsx($post, $filename) {
        $respArray = $this->tableService->getData($post);

        $data = array();
        foreach ($respArray['data'][0] as $key => $val) {
            if (($respArray['key_settings'][$key])->name && $key != "id") {
                $data[0][$key] = ($respArray['key_settings'][$key])->name;
            } else {
                $data[0][$key] = $key;
            }
        }

        foreach ($respArray['data'] as $row) {
            $data[] = (array)$row;
        }

        $writer = Excel::create($filename, function($excel) use ($data) {
            $excel->sheet('Sheet1', function($sheet) use ($data) {
                $sheet->fromArray($data, null, 'A1', true, false);
            });
        });
        return $writer->export('xlsx');
    }

    /*
     * Create data flow for pdf file
     */
    private function downloader_pdf($post) {
        $visibleColumns = (array)json_decode($post->visibleColumns);

        $respArray = $this->tableService->getData($post);

        $html = "<table style='border-collapse: collapse;' width=\"100%\" page-break-inside: auto;>";
        $titles = array();
        foreach ($respArray['data'][0] as $key => $val) {
            $titles[$key] = ($respArray['key_settings'][$key])->name;
        }

        $html .= "<thead><tr>";
        foreach ($titles as $key => $title) {
            if ($visibleColumns[$key]) {
                $html .= "<th style='border: solid 1px #000;padding: 3px 5px;background-color: #AAA;'>".$title."</th>";
            }
        }
        $html .= "</tr></thead>";

        $html .= "<tbody>";
        foreach ($respArray['data'] as $row) {
            $html .= "<tr>";
            foreach ((array)$row as $key => $item) {
                if ($visibleColumns[$key]) {
                    $html .= "<td style='border: solid 1px #000;padding: 3px 5px;'>".$item."</td>";
                }
            }
            $html .= "</tr>";
        }
        $html .= "</tbody>";
        $html .= "</table>";

        $pdf = new Dompdf();
        $pdf->setPaper("A4", "landscape");
        $pdf->loadHtml($html);
        $pdf->render();

        return $pdf->output();
    }
}
